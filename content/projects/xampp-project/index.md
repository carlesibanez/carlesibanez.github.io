---
title: 'Migrating Xampp to Docker'
description: ""
date: '2024-09-16'
tags: ["Docker"]
github: "https://github.com/carlesibanez/XamppToDocker"
draft: true
---
# Introduction

When working with code, reproducibility is often overlooked. Fortunately, using the right tools can make working with isolated environments that perform consistently across different machines a straightforward task. This is where **Docker** comes into play. [Docker](https://www.docker.com/}) is a platform that allows applications to run in containers, separating the application from the underlying infrastructure. This enables users to develop, test, and ship code quickly, avoiding the infamous "But it worked on my machine!" scenario.


The motivation for this project was rediscovering an old [Joomla](https://www.joomla.org/) website on my hard drive. Back when the site was actively developed, I used [Xampp](https://www.apachefriends.org/es/index.html) for local testing before deployment. However, this setup dated back to 2016, meaning that the versions of the services it relied on had likely reached end-of-life (EOL).

To preserve the website for future reference—and since it would need significant updates before redeployment—I decided to migrate the Xampp environment to a modern solution using Docker.


# Initial checks
Before beginning the migration, the first step was to confirm that the Xampp environment still worked and could load the site locally. To do this, I launched the Xampp control panel and started the two services required for the Joomla site, as shown in the image below:

{{< figure src="control-panel.png" >}}

From the Xampp control panel, it's clear that Joomla requires an Apache server and a MySQL database to function properly. Additionally, using phpMyAdmin to manage the database is a good practice. Therefore, to fully migrate the site, we will need the following Docker containers:

* phpApache server
* MySQL database
* phpMyAdmin

Using the Xampp control panel, under `Help` > `View ReadMe`, I found the exact versions of the services running in the Xampp environment. The key versions of interest are as follows:


```bash
  + Apache 2.4.4
  + MySQL 5.5.32 (Community Server)
  + PHP 5.6.15 (VC11 X86 32bit thread safe) + PEAR 
  + phpMyAdmin 4.0.4
  ...
```

# Creating the docker environment

With the requirements clear, I could begin migrating to Docker. When using Docker to run multiple services, it's common to use a `docker-compose.yml` file, which defines how to start and manage each service. Each service runs in an isolated container, which is created from an image. Many pre-built images are available on platforms like [Dockerhub](https://hub.docker.com/), a registry for hosting and sharing Docker images.

Developers and organizations can create Docker images for others to use. In this case, I needed three containers: a PHP-Apache container, a MySQL container, and a phpMyAdmin container.


## Php-Apache container
The first container needed is for PHP and Apache. I found the appropriate image on the [PHP DockerHub](https://hub.docker.com/_/php/) repository and chose the `5.6.15-apache` tag, matching the version used in Xampp. Since the Apache server will be interacting with the MySQL database, I needed to install the MySQL extension for PHP. Additionally, I copied the `php.ini` file from the Xampp installation to the Docker container for consistency.

To simplify this setup, I created a Dockerfile to build a custom image for the PHP-Apache container. Here’s the Dockerfile for the `custom-php` container:

{{<gist carlesibanez c86aae4719e541ef78b198dc6c7cea78>}}


After building the image, I added the container definition to the `docker-compose.yml` file. In addition to specifying the image, I mounted the `htdocs` directory from Xampp (renamed to `src`) and exposed port 80 from the container to the host. I also used the `depends_on` tag to ensure the PHP-Apache container starts after the MySQL container and added both to a custom Docker network. The relevant part of the `docker-compose.yml` file looks like this:

{{<gist carlesibanez 3c86dd9cd05cd21adbf374fbdf59bdc0>}}

## MySQL container
Next, I set up the MySQL container to handle the database. The closest matching image I found on DockerHub was version _5.5.40_, and there was also a more recent _5.5_ tagged image, so I used that for this project. Setting up this container was straightforward using the `docker-compose.yml` file, where I configured the required volumes and environment variables (like database name, user, and password). Here’s the corresponding part of the `docker-compose.yml` file for the MySQL container:

{{<gist carlesibanez 0f161e11f126d8cbc056c8de522f1194>}}

## PhpMyAdmin container
As mentioned earlier, having phpMyAdmin helps manage the database. The challenge here was that the version I needed, _4.0.4_, wasn't available on DockerHub, with the oldest being _5.0.2_. After some research, I found a GitHub repository created by rez0n (check the repo [here](https://github.com/rez0n/docker-phpmyadmin-4.0.x)), which provided the resources to build a Docker image for phpMyAdmin 4.0.x. I used the Dockerfile from this repository to create the image:

{{<gist carlesibanez c835f4de9eb4f5da18e66cdaa4c0525e>}}

After building the image, I added the phpMyAdmin container declaration to the `docker-compose.yml` file. Here’s how that section looks:


ADD GITHUB GIST FOR PHPMYADMIN PART ON DOCKER-COMPOSE
{{<gist carlesibanez 0ec9cff6a9039a672c303f29358baccd>}}

Once everything is in place in the `docker-compose.yml`, I used the `docker compose up` command to start all the services at once. Then the website became available on localhost at port 80, and the phpMyAdmin console became available on port 8080 as specified.

# Conclusion
Migrating the Joomla website from a legacy Xampp environment to Docker was a rewarding experience that highlights the power of containerization for preserving and running older applications. By leveraging Docker's ability to encapsulate services in isolated containers, I was able to recreate the exact environment required for the website, ensuring long-term reproducibility and easier management.

Docker's flexibility means that this environment can now be easily moved, scaled, or modified without worrying about compatibility issues. In the end, Docker provided a sustainable and efficient solution to breathe new life into an old project, ensuring it remains accessible for future use.

For more details on the code, check out the project repo.
