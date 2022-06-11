export function formatTags(tags: Map<string, string>): string {
  const data = `<Tagging>
<TagSet>
    ${[...tags.entries()]
      .map(
        ([key, value]) =>
          `<Tag>
            <Key>${key}</Key>
            <Value>${value}</Value>
        </Tag>`
      )
      .join("\n")}
   
</TagSet>
</Tagging>`;

  return data;
}
