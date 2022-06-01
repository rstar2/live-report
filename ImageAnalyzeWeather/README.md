# develop

1. create a virtual environment with **venv**

```cd ImageAnalyzeWeather```     - cd in folder
```python3 -m venv venv```       - create a virtual-environment in the folder 'venv' (can be named whatever)
```source venv/bin/activate```   - activate it

```pip install matplotlib```     - install necessary python packages

```pip freeze > requirements.txt```   - will output all used packages into the 'requirements.txt' file
```pip install -r requirements.txt``` - will install all packages from this 'requirements.txt' file

```deactivate```                 - deactivate finally the virtual-environment
