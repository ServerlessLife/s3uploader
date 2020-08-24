window.onload = async () => {
    const usernameInput = document.getElementById('username-input');
    const passwordInput = document.getElementById('password-input');
    const fileInput = document.getElementById('file-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', sendFile);

    function sendFile() {
        upload(fileInput.files[0])
    };

    async function upload(file) {
        let env = await getEnvVariables();
        let authResult = await login(env.UserPoolClientId, usernameInput.value, passwordInput.value);
        let url = await getUploadUrl(env.ServiceEndpoint + "/uploadlink", file.type, authResult.AuthenticationResult.IdToken);

        let fileResp = await fetch(url, {
            method: 'PUT',
            body: file
        })

        if (fileResp.ok) {
            alert("File uploaded");
        }
        else {
            alert("Error uploading file");
        }
    };

    /**
     * Log in user.
     * @param {string} userPoolClientId 
     * @param {string} userPoolClientId - Cognito user pool client ID
     * @param {string} username
     * @param {string} password 
     */
    async function login(userPoolClientId, username, password) {
        var loginRequest = {
            "AuthFlow": "USER_PASSWORD_AUTH",
            "AuthParameters": {
                "USERNAME": username,
                "PASSWORD": password
            },
            "ClientId": userPoolClientId
        };

        let loginResponse = await fetch("https://cognito-idp.eu-west-1.amazonaws.com/", {
            method: "POST",
            headers: {
                "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
                "Content-Type": "application/x-amz-json-1.1"
            },
            body: JSON.stringify(loginRequest)
        })
        let authResult = await loginResponse.json();

        return authResult;
    }

    /**
     * Get upload URL, which is valid for 5 min.
     * @param {string} apiUrl 
     * @param {string} contentType - contentType
     * @param {string} authenticationIdToken  - Authentication IdToken from Cognito
     */
    async function getUploadUrl(apiUrl, contentType, authenticationIdToken) {
        let urRequest = {
            contentType: contentType
        };

        let getUrlResp = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                "Authorization": authenticationIdToken
            },
            body: JSON.stringify(urRequest)
        });

        let url = await getUrlResp.text();
        return url;
    }

    /**
     * Environment variables that are created dooring deployment.
     */
    async function getEnvVariables() {
        let r = await fetch("env_variables.json");
        return await r.json();
    }
}