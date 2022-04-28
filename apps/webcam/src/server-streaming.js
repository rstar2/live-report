const child_process = require("child_process");

const ws = require("ws");
const cron = require("node-cron");
const stripAnsi = require("strip-ansi");

const logger = require("./lib/logger");
const { createNewHistoryImageName } = require("./lib/history");

// here will come the HTTP live stream
const PORT_STREAM = process.env.WEBCAM_PORT_STREAM || 8888;

// here a client will connect and receive the broadcasted stream
const PORT_WEBSOCKET = process.env.WEBCAM_PORT_WEBSOCKET || 9999;

// whether or not to spawn internally ffmpeg-capturing when needed
const INTERNAL_FFMPEG_PROCESS = process.env.WEBCAM_INTERNAL_FFMPEG_PROCESS !== "false";

const STREAM_MAGIC_BYTES = "jsmp"; // Must be 4 bytes

const WIDTH = 320,
  HEIGHT = 240;

const HISTORY_CAPTURE_TRY_AGAIN_TIMEOUT = 1000 * 60 * 1; // 1 min
const HISTORY_CAPTURE_TRY_AGAIN_MAX_ATTEMPTS = 5;
// const HISTORY_CAPTURE_CRON = "* * * * *"; // every minute - for testing only
const HISTORY_CAPTURE_CRON = "0 7-19 * * *"; // every 1 hour from 7 to 19

let history_try_again_attempts = 0;
// schedule a history image capture
cron.schedule(HISTORY_CAPTURE_CRON, historyCaptureTry);

/**
 * Created only if INTERNAL_FFMPEG_PROCESS is true
 * @type {child_process.ChildProcess}
 */
let webCapture;

// 1. Websocket Server - that listens for client connections
const socketServer = new ws.Server({ port: PORT_WEBSOCKET });
socketServer.on("connection", (socket) => {
  if (logger.isDebug())
    logger.debug(`New WebSocket Connection (${socketServer.clients.size} total)`);

  socket.on("close", (/* code, message */) => {
    if (logger.isDebug())
      logger.debug(`Disconnected WebSocket (${socketServer.clients.size} total)`);

    // if this is last client then stop web-capturing
    if (socketServer.clients.size === 0) {
      stopWebCapture();
    }
  });

  // Send magic bytes and video size to the newly connected socket
  // so that client can understand that this is MPEG stream format

  // struct { char magic[4]; unsigned short width, height;}
  const streamHeader = Buffer.alloc(8); // 8 octets
  streamHeader.write(STREAM_MAGIC_BYTES); // 4 octets
  streamHeader.writeUInt16BE(WIDTH, 4); // 2 octets
  streamHeader.writeUInt16BE(HEIGHT, 6); // 2 octets
  socket.send(streamHeader, { binary: true });

  // if this is first client then start web-capturing
  if (socketServer.clients.size === 1) {
    startWebCapture();
  }
});

socketServer.broadcast = (data, opts) => {
  // this here is socketServer
  socketServer.clients.forEach((socket) => {
    if (socket.readyState === ws.OPEN) {
      socket.send(data, opts);
    } else {
      console.log("Error: Client (" + socket + ") not connected.");
    }
  });
};

// 2. HTTP Server to accept incoming MPEG Stream (from FFmpeg for instance)
const streamServer = require("http").createServer((request, response) => {
  response.setTimeout(0);

  logger.info("Stream Connected - and feeding");

  // on each new data received on the HTTP request as it's a stream :)
  // then broadcast it to all connected clients
  request.on("data", (data) => {
    socketServer.broadcast(data, { binary: true });
  });
});
streamServer.listen(PORT_STREAM);

/**
 * Start web-capturing process
 */
function startWebCapture() {
  if (!INTERNAL_FFMPEG_PROCESS) return;

  if (webCapture) {
    logger.warn("Already started web-capturing process");
  } else {
    if (logger.isDebug()) logger.debug("Starting web-capturing process");
    webCapture = child_process.spawn("./ffmpeg-webcapture-stream.sh", { detached: true });
    if (logger.isDebug()) logger.debug("Started web-capturing process");

    // webCapture = child_process.exec(
    //   'ffmpeg -f v4l2 -video_size 640x480 -framerate 25 -i /dev/video0 -f alsa -ar 44100 -ac 2 -i hw:0 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 -codec:a mp2 -b:a 128k -muxdelay 0.001 http://127.0.0.1:8888',
    //   { detached: true }
    // );

    // webCapture = child_process.spawn(
    //   'ffmpeg -f v4l2 -video_size 640x480 -framerate 25 -i /dev/video0 -f alsa -ar 44100 -ac 2 -i hw:0 -f mpegts -codec:v mpeg1video -s 640x480 -b:v 1000k -bf 0 -codec:a mp2 -b:a 128k -muxdelay 0.001 http://127.0.0.1:8888',
    //   { detached: true }
    // );
  }
}

/**
 * Stop web-capturing process
 */
function stopWebCapture() {
  if (!INTERNAL_FFMPEG_PROCESS) return;

  if (!webCapture) {
    logger.warn("Already stopped web-capturing process");
  } else {
    if (logger.isDebug()) logger.debug("Stopping web-capturing process");

    try {
      // NOTE: this is not working as I guess the there's underlying 'ffmpeg' process started
      // webCapture.kill();
      // so kill the group the process is in
      // https://stackoverflow.com/questions/56016550/node-js-cannot-kill-process-executed-with-child-process-exec/56016614
      // NOTE: It's not just webCapture.pid, but -webCapture.pid ,
      // which instructs process.kill to kill the process group the PID belongs
      // other option is to use 'fkill' module, but no need for now
      process.kill(-webCapture.pid);

      if (logger.isDebug()) logger.debug("Stopped web-capturing process");
    } catch (err) {
      logger.warn("Failed to stop web-capturing process", err);
    }

    webCapture = undefined;
  }
}

function historyCaptureTry() {
  // check is currently the webcam is streaming
  // as we cannot use it in the same time for single capturing
  if (webCapture) {
    // try max HISTORY_CAPTURE_TRY_AGAIN_MAX_ATTEMPTS
    if (history_try_again_attempts < HISTORY_CAPTURE_TRY_AGAIN_MAX_ATTEMPTS) {
      history_try_again_attempts++;
      setTimeout(historyCaptureTry, HISTORY_CAPTURE_TRY_AGAIN_TIMEOUT);
    } else {
      // reset "tries" , so to be ready for next scheduled capture
      history_try_again_attempts = 0;
    }
  } else {
    // reset "tries"
    history_try_again_attempts = 0;
    historyCapture();
  }
}
function historyCapture() {
  const historyFile = createNewHistoryImageName();
  // capture and write a file
  if (logger.isDebug()) logger.debug(`Start history image capture ${historyFile} on ${new Date()}`);

  // do it sync, so that web-streaming would not kick in - this is not super user friendly as
  // it will introduce some delay/blocking in handling the other HTTP/WS request, but is ok for this app
  //   const output = child_process.execSync(`./ffmpeg-webcapture-image.sh ${historyFile}`, {
  //     encoding: "utf-8",
  //     stdio: "inherit",
  //   });

  const output = child_process.spawnSync("./ffmpeg-webcapture-image.sh", [historyFile], {
    encoding: "utf-8",
  });

  if (logger.isDebug()) {
    logger.debug(`Finish history image capture ${historyFile} on ${new Date()}
Output:
${stripAnsi(output.stderr)}`);
  }
}

logger.info(`INTERNAL_FFMPEG_PROCESS=${INTERNAL_FFMPEG_PROCESS}`);
logger.info(`Listening for MPEG Stream on http://0.0.0.0:${PORT_STREAM}`);
logger.info(`Awaiting client WebSocket connections on ws://0.0.0.0:${PORT_WEBSOCKET}`);
