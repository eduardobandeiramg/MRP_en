# Requirements

* [Node.js](https://nodejs.org/en) - Link to download
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) - Link to download

## Running Locally

1. Create a file named `.env` in the `/back-end` folder. This file should contain the following environment variables:

    ```bash
    MYSQL_ROOT_PASSWORD=
    MYSQL_DATABASE=
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USERNAME=root
    MYSQL_PASSWORD=
    JWT_SECRET=aebfde0b-ff4a-4f1c-9c43-a1c034d5b4b1

    EMAIL_HOST=
    EMAIL_PORT=
    EMAIL_USER=
    EMAIL_PASSWORD=
    ```

2. Set the values for `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`, and `MYSQL_DATABASE` as per your choice. Example:

    ```bash
    MYSQL_ROOT_PASSWORD=yourpassword
    MYSQL_DATABASE=yourdatabase
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USERNAME=root
    MYSQL_PASSWORD=yourpassword
    JWT_SECRET=aebfde0b-ff4a-4f1c-9c43-a1c034d5b4b1
    ```
3. Generate a email in https://ethereal.email/create and set e variables: 

    ```bash
    EMAIL_HOST=smtp.ethereal.email
    EMAIL_PORT=587
    EMAIL_USER=david.morissette75@ethereal.email
    EMAIL_PASSWORD=C4rSKuXBWeDVfFMWv4
    ```


3. Open a terminal and navigate to the `/back-end` folder.

4. Run the following command to install the dependencies:

    ```bash
    npm install
    ```

5. Start the Docker containers using the following command:

    ```bash
    docker-compose up
    ```

6. Docker will automatically create the database for you.

7. While Docker is running (you can close the terminal if using Docker Desktop), use MySQL Workbench or Visual Studio to connect to the database on port `3306` using the `root` user and `localhost` as the server address.

8. Finally, start the development server by running:

    ```bash
    npm run start:dev
    ```
