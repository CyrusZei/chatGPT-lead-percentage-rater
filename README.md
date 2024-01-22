# ChatGPT Lead Percentage Rater

## Overview

This project is a ChatGPT-based Lead Percentage Rater. It utilizes the OpenAI's GPT model to analyze and rate leads based on their potential interest level. The rating is provided as a percentage, ranging from 0% (indicating a cold lead) to 100% (indicating a hot lead).

## Getting Started

### Prerequisites

- Node.js installed on your machine.
- An Azure API key for accessing OpenAI services.

### Installation

1.  **Clone the Repository** Clone the project to your local machine. You can do this by running the following command in your terminal:

    `git clone [URL of the Git repository]`

2.  **Install Dependencies** Navigate to the project directory and install the necessary packages using Yarn. Run:

    `yarn install`

3.  **Environment Setup** Create a `.env` file in the root directory of the project. Add your Azure API key to this file as follows:

    `AZURE_API_KEY=YOUR-AZURE-API-KEY`

    and also add your azure deployment id

    `DEPLOYMENT_ID=YOUR-DEPLOYMENT-ID`

    Replace `YOUR-AZURE-API-KEY` with your actual Azure API key.
    Replace `YOUR-DEPLOYMENT-ID` with your actual Azure deployment id.

4.  **Running the Application** To start the application, run the following command in your terminal:

    `node ai.js`

## Usage

Once the application is running, it will automatically process the predefined lead data in `ai.js`. The output will display the rated percentage of the lead, helping you understand its potential.

## Contributing

Contributions to improve this application are welcome. Please feel free to fork the repository, make changes, and submit a pull request.
