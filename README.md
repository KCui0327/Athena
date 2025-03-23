<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/KCui0327/Athena">
    <img src="images/athena.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Athena</h3>

  <p align="center">
    An AI web app that empowers  students study smarter by turning raw materials (notes, images, and video links) into summarized, interactive, and multimedia study content
    <br />
    <a href="https://github.com/KCui0327/Athena"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/KCui0327/Athena">View Demo</a>
    &middot;
    <a href="https://github.com/KCui0327/Athena/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/KCui0327/Athena/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
    <li><a href="#future-enhancements">Future Enhancements</a></li>
    <li><a href="#testing">Testing</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Athena is a webapp that enables students to upload notes, images, share links to videos.
Athena will summarize the notes, create study guides, create quizzes and generate videos based on their notes. These videos will be snippets of YouTube videos that are relevant. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* [![Typescript][Typescript]][Typescript-url]
* [![Javascript][Javascript]][Javascript-url]
* [![Tailwind][Tailwind]][Tailwind-url]
* [![Docker][Docker]][Docker-url]
* [![Terraform][Terraform]][Terraform-url]
* [![GCP][GCP]][GCP-url]
* [![PYTHON][PYTHON]][PYTHON-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.
### Prerequisites
Before you begin, ensure you have the following installed on your machine:

1. **Node.js and npm**  
  Install Node.js, which includes npm (Node Package Manager). You can download it from [Node.js official website](https://nodejs.org/).

2. **Python**  
  Install Python (version 3.7 or higher). You can download it from [Python's official website](https://www.python.org/).  
  Verify the installation by running:
  ```bash
  python --version
  ```
  Install `pip`, the Python package manager, if it is not already installed:
  ```bash
  python -m ensurepip --upgrade
  ```

3. **Terraform**  
  Install Terraform by following these steps:
  - Download the appropriate package for your operating system from the [Terraform downloads page](https://www.terraform.io/downloads.html).
  - Unzip the package and move the binary to a directory included in your system's PATH.
  - Verify the installation by running:
    ```bash
    terraform --version
    ```

4. **Docker**  
  Install Docker to run containerized applications. You can download it from [Docker's official website](https://www.docker.com/).  
  Verify the installation by running:
  ```bash
  docker --version
  ```
  Ensure Docker is running and you have the necessary permissions to execute Docker commands.

5. **Google Cloud Platform (GCP) Account**  
  - Register for a GCP account at [Google Cloud Console](https://console.cloud.google.com/).
  - Create a new project in the GCP Console.
  - Enable the necessary APIs (e.g., Cloud Storage, Compute Engine, etc.).
  - Download a service account key in JSON format and set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable:
    ```bash
    export GOOGLE_APPLICATION_CREDENTIALS="path/to/your-service-account-key.json"
    ```

---

### Installation

Follow these steps to set up the project locally:

#### 1. Clone the Repository
```bash
git clone https://github.com/KCui0327/Athena.git
cd Athena
```

#### 2. Backend Setup and Execution
Navigate to the `src/backend` directory and set up a virtual environment:

1. **Create a Virtual Environment**  
  Run the following command to create a virtual environment:
  ```bash
  python -m venv venv
  ```
  Activate the virtual environment:
  - On macOS/Linux:
    ```bash
    source venv/bin/activate
    ```
  - On Windows:
    ```bash
    venv\Scripts\activate
    ```

2. **Install Dependencies**  
  Install the required Python packages:
  ```bash
  pip install -r requirements.txt
  ```

3. **Create a `.env` File**  
  Create a `.env` file in the `src/backend` directory to store secrets for GCP and databases. Add the following variables:
  ```env
  GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account-key.json
  DATABASE_URL=your-database-connection-string
  ```
  Replace `path/to/your-service-account-key.json` and `your-database-connection-string` with the appropriate values.

4. **Run the Backend**  
  At the project root directory, start the FastAPI development server:
  ```bash
  fastapi dev src/backend/main.py
  ```

#### 3. Frontend Setup
Navigate to the `src/frontend` directory, install the dependencies, and run the program:

```bash
cd ../frontend
npm install
npm run dev
```

#### 4. Initialize and Apply Terraform Configuration
From the root project directory, run the following commands:

1. **Initialize Terraform**  
  This command initializes the Terraform working directory by downloading the necessary provider plugins and preparing the environment:
  ```bash
  terraform init
  ```

2. **Plan the Deployment**  
  This command creates an execution plan, showing what actions Terraform will take to achieve the desired state:
  ```bash
  terraform plan
  ```

3. **Apply the Configuration**  
  This command applies the changes required to reach the desired state of the configuration:
  ```bash
  terraform apply
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Features

- Upload notes, images, and video links.
- Summarize notes into concise study guides.
- Generate quizzes based on uploaded content.
- Create multimedia study materials, including video snippets from YouTube.
- Scalable infrastructure using Terraform and GCP.
- Containerized deployment with Docker.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Future Enhancements

- Add support for additional file formats (e.g., PDFs, Word documents).
- Integrate with more cloud providers (e.g., AWS, Azure).
- Implement advanced AI models for personalized study recommendations.
- Add collaborative features for group study sessions.
- Enhance accessibility features for visually impaired users.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Testing

To ensure the project works as expected, follow these steps to run tests:

1. **Backend Tests**  
   Navigate to the `src/backend` directory and run:
   ```bash
   pytest
   ```

2. **Frontend Tests**  
   Navigate to the `src/frontend` directory and run:
   ```bash
   npm test
   ```

3. **End-to-End Tests**  
   Use a testing framework like Cypress for end-to-end testing. Install Cypress and run:
   ```bash
   npx cypress open
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the project_license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

* **Kenny C** - [KCui0327](https://github.com/KCui0327)
* **Ambrose L** - [janesmitambroselingh](https://github.com/ambroseling)
* **Simon L** - [simonlouis15](https://github.com/simonlouis15)
* **Liza A** - [L-Abraham](https://github.com/L-Abraham)


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [React.js](https://reactjs.org/) - A JavaScript library for building user interfaces.
* [TypeScript](https://www.typescriptlang.org/) - A strongly typed programming language that builds on JavaScript.
* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - A versatile programming language for web development.
* [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for styling.
* [Docker](https://www.docker.com/) - A platform for developing, shipping, and running applications in containers.
* [Terraform](https://www.terraform.io/) - An infrastructure as code tool for building and managing cloud resources.
* [Google Cloud Platform (GCP)](https://cloud.google.com/) - A suite of cloud computing services.
* [Python](https://www.python.org/) - A high-level programming language for general-purpose programming.
* [Large Language Models (LLMs)](https://en.wikipedia.org/wiki/Large_language_model) - AI models that assist in generating code and improving development efficiency.
* [Gemini](https://blog.google/technology/ai/google-gemini-ai/) - A cutting-edge AI model that enhances the project's capabilities through advanced natural language understanding.

>Acknowledgments:
This project leverages the above technologies to deliver a robust and scalable solution. Special thanks to the open-source community for maintaining these tools and frameworks, and to advancements in AI, particularly LLMs and Gemini, for enhancing our coding process.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/KCui0327/Athena/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/home.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://www.typescriptlang.org/
[Javascript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[Javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Docker]: https://img.shields.io/badge/docker-257bd6?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[Tailwind]: https://img.shields.io/badge/Tailwind_CSS-grey?style=for-the-badge&logo=tailwind-css&logoColor=38B2AC
[Tailwind-url]: https://tailwindcss.com/
[Terraform]: https://img.shields.io/badge/terraform-%235835CC.svg?style=for-the-badge&logo=terraform&logoColor=white
[Terraform-url]: https://www.terraform.io/
[GCP]: https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white
[GCP-url]: https://cloud.google.com
[PYTHON]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[PYTHON-url]: https://www.python.org/
