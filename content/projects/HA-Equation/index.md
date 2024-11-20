---
title: 'Controlling WiFi-Enabled Radiators with Home Assistant'
description: ""
date: '2024-11-12'
tags: ["API", "Home Assistant", "Python"]
github: "https://github.com/carlesibanez/Home-Assistant-equation-connect"
draft: false
---

# Introduction


With the rise of smart home devices, automation has become a central part of creating a convenient, energy-efficient living environment. However, smart devices often come from many different brands, each typically requiring its own app or platform for management and control. This challenge led to the creation of unified platforms, such as [Home Assistant](https://www.home-assistant.io/), which aim to bring control of various devices into one place. Home Assistant, one of the most popular of these platforms, is open-source and has a highly active community. It’s even officially supported by several manufacturers, making it an ideal choice for users and developers alike. Additionally, Home Assistant’s open-source nature allows developers to contribute by creating their own [integrations](https://developers.home-assistant.io/docs/creating_component_index) if a device is not yet supported.

This project began as my solution to a similar challenge. I had WiFi-enabled radiators that weren’t supported in Home Assistant, requiring me to use the vendor’s app to control them. Bringing these radiators into Home Assistant would allow me to not only control them remotely but also integrate them with automations—such as adjusting the temperature based on time of day or outdoor weather. These radiators are branded _Equation_ and sold at Leroy Merlin, and they require the Equation Connect app for remote control.

After researching potential solutions, I discovered [equation-connect](https://github.com/AndreMiras/equation-connect), a project by Andre Miras that provides a web UI as an alternative to the vendor’s mobile-only app. This project is built on top of [equation-conect.js](https://github.com/AndreMiras/equation-connect.js), a JavaScript library by the same developer that handles API interactions. Since I wanted to build a Home Assistant integration, I chose Python as a more suitable language for this purpose. I began by creating a Python SDK to interact with the radiators, which could then serve as the foundation for a Home Assistant integration, bringing full control directly into the Home Assistant interface.


# Developing the SDK

The SDK is the backbone of this project, enabling direct interaction with the radiator’s API. Since the API was not officially available from the manufacturer, I used the previously mentioned JavaScript library as a starting point. Here’s an outline of the development process:

1. __Understanding the JavaScript SDK__: The first step was to review the JavaScript library to identify the API endpoints it utilized and the parameters required for each one. To facilitate this, I used [Postman](https://www.postman.com/) to quickly test the endpoints and confirm their behavior.

2. __Designing the SDK__: The SDK was designed to be flexible, supporting the essential functionalities I needed for an mvp—such as turning radiators on and off and adjusting the temperature—while leaving room for future enhancements, like toggling the display backlight or switching between presets. I developed the SDK as a standalone Python package to ensure it could be reused in other Python projects and extended easily. To maintain modularity and minimize errors, I relied on the [Pyrebase4](https://github.com/nhorvath/Pyrebase4) library for handling API calls.


With these goals in mind, I began coding the API class, which contains the methods for interacting with the Firebase API. These methods are grouped into three main categories:

* __Authentication__ methods: These handle user authentication with the [Firebase Auth REST API](https://firebase.google.com/docs/reference/rest/auth). They also manage token validity, ensuring the token required for API access is renewed when necessary.

* __Get__ methods: These `GET` methods retrieve information from the API, such as user details, the installations linked to a user, or the properties of a specific device.

* __Set__ methods: These `PATCH` methods update device properties, such as toggling the power state (turning the radiator on or off) or adjusting the temperature.

The source code for the SDK, along with its documentation and details about the endpoints used, can be found in the [Equation-Connect-SDK repo](https://github.com/carlesibanez/Equation-Connect-SDK).  
Once the SDK reached a stable state, the next step was integrating it into Home Assistant as a custom integration.


# Creating the integration

After reviewing the [Home Assistant documentation for new integrations](https://developers.home-assistant.io/docs/creating_component_index), I began coding. The first step was deciding which entities would represent and control each radiator's functions and properties. To manage the power state and target temperature for a radiator, I used [ClimateEntity](https://developers.home-assistant.io/docs/core/entity/climate/). This entity type supports HVAC modes (which can correspond to power states) and temperature control, making it an ideal fit for this application.

The integration for Equation Connect is organized into five primary files:

* `manifest.json`: This file contains metadata about the integration, including its domain, version, dependencies, and other essential details that help Home Assistant manage the integration.

* `const.py`: This file holds constants such as the integration's domain, platform names, and any other static values referenced throughout the codebase.

* `__init__.py`: This file acts as the entry point of the integration. It manages the setup and teardown of the integration, initializes the API, and forwards configuration to the respective platforms.

* `climate.py`: This file implements the ClimateEntity interface, which represents the radiator as a controllable device in Home Assistant. It defines methods for controlling the HVAC mode and temperature, as well as retrieving the current state.

* `config_flow.py`: This file handles the user configuration flow during setup. It validates user-provided credentials and ensures a seamless setup process.

In the following sections, we'll delve deeper into the implementation of `__init__.py`, `climate.py`, and `config_flow.py`. All the files can be found in the [project repository](https://github.com/carlesibanez/Home-Assistant-equation-connect), as well as the instructions to install the integration and initial setup.


## `__init__.py` - Setting up the integration

This file is the one responsible for initializing and tearing down the integration. It retreives the username and passowrd to authenticate using the SDK. Then it fetches the devices associated with the user's account and stores them in `hass.data` to be used by each entity type setup function. Here's the two methods that handle setup and teardown:

{{<gist carlesibanez bb7a838e58bfca9a8481ed20eaea2aec>}}

## `climate.py` - Implementing the radiator entity

This file implements the `ClimateEntity`, which integrates the radiator into Home Assistant. Here, each `EquationConnectThermostat` represents a radiator, with its attributes, i.e. name, unique ID and temperature unit. What's more, the file also contains the control methods such as the ones below to change the temperature or the power state:

{{<gist carlesibanez 4e9fb00d40e407aa71893f017e4573cd>}}

## `config_flow.py` - Handling user configuration

This file is not mandatory, since it is used to get the user to input the username and password to authenticate using the SDK. After inputing these, the authenticate method attempts to authenticate and only if the result is successful, the integration is considered to be properly initialized, and the credentials are saved. Here are the two methods that handle the parsing of the user input and the call to the SDK's initialization:

{{<gist carlesibanez bf083de7e5075885f6f413a5746b6f7f>}}

# Conclusion and future work

As a result of this project I have been able to create a simple and open-source solution that allows anyone with Equation electric radiators to add them to their existing Home Assistant setup in an easy way. Creating this integration was not only about being able to control my radiators through Home Assistant but also it allowed me to showcase the value of custom smart home integrations, while collaborating in a open-source project. While the core functionality is complete, there are areas I plan to improve, such as enhancing error handling, adding support for extra features like backlight control or using the [httpx](https://www.python-httpx.org/) python package for the requests (as it has better support from Home Assistant).

Overall, this project has given me invaluable hands-on experience with API development, SDK creation, and Home Assistant integrations, making it a rewarding learning process that I hope will help others in similar situations.
