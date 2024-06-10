# ExodusRecovery

ExodusRecovery is a tool designed to provide a JSON backup file from a private key to use it as an import option in the Lisk Desktop Wallet

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js version 18 installed on your machine. If you don't have Node.js installed, follow the instructions in the Installation section.

## Installation (Ubuntu 20+)

### Installing Node.js using NVM (Node Version Manager)

If you don't have Node.js or NVM installed, or if you need to manage multiple Node.js versions, follow these steps:

1. Open your terminal.
2. Install NVM by running the following command. This script will install NVM in your home directory:
   
   `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
   
   or
   
   `wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
   
4. Once the script completes, close and reopen your terminal
   or `source ~/.bashrc`
6. Install Node.js version 18 using NVM by running:

    `nvm install 18`
   
### Cloning the Repository

1. Install git
   
   `sudo apt-get install git`
   
2. Clone the repository

   `git clone https://github.com/przemerr/exodusRecovery.git`
  
    `cd exodusRecovery`

### Install Dependencies

Run the following command to install the necessary Node.js dependencies:

  `npm install`

### Usage
To use the script, simply run:

  `node exodusRecovery.js`

The script will ask for all the necessary details:

- a private key
- a password of your chosing for the private key encryption

Copy the JSON output and paste it in the Lisk Desktop Wallet when importing the account

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
### Make sure you're executing the script in a safe enviornment, your private key might get leaked. After importing the account, it's best to transfer the funds from the account, it's best to not reuse the private key.
### I'm not responsible for any token loses. Use at your own risk.
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
