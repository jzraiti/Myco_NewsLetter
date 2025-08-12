# My Lambda Project

## Overview
This project is an AWS Lambda application that utilizes a Lambda layer for shared functionality. It is structured to separate the main Lambda function, event handlers, utility functions, and common code into distinct modules.

## Project Structure
```
my-lambda-project
├── src
│   ├── lambda_function.py       # Entry point for the AWS Lambda function
│   ├── handlers                  # Directory for event handlers
│   │   └── __init__.py
│   └── utils                     # Directory for utility functions
│       └── __init__.py
├── layer                         # Directory for Lambda layer
│   └── python
│       ├── __init__.py
│       └── common.py             # Common functions for shared use
├── requirements.txt              # Dependencies for the main Lambda function
├── layer-requirements.txt        # Dependencies for the Lambda layer
├── template.yaml                 # AWS SAM template for infrastructure
└── README.md                     # Project documentation
```

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd my-lambda-project
   ```

2. **Install dependencies**:
   - For the main Lambda function:
     ```
     pip install -r requirements.txt
     ```
   - For the Lambda layer:
     ```
     pip install -r layer-requirements.txt -t layer/python
     ```

3. **Deploy the application**:
   Use the AWS SAM CLI to build and deploy the application:
   ```
   sam build
   sam deploy --guided
   ```

## Usage
- The main handler function is defined in `src/lambda_function.py`. You can modify this file to implement your business logic.
- Add any additional event handlers in the `src/handlers` directory.
- Utility functions can be placed in the `src/utils` directory for reuse across different modules.
- Common functions that need to be shared across multiple Lambda functions can be added to `layer/python/common.py`.

## License
This project is licensed under the MIT License.