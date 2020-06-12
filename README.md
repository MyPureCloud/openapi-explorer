# OpenAPI Explorer
The OpenAPI explorer is a different take on Swagger UI and is a way to view a [OpenAPI/Swagger](http://swagger.io/) definition and execute API calls

## Installation

* `git clone <repository-url>` this repository
* `cd openapi-explorer`
* `npm install`
* `bower install`

## Generate Self-Signed Certs

The dev tools project must be run using HTTPS for web chat to work. To disable SSL, remove the `"ssl"` property from `.ember-cli`.

These instructions are based on [these](https://devcenter.heroku.com/articles/ssl-certificate-self). 

```
# Make and use ssl dir in this repo
mkdir ssl
cd ssl

# Generate keys
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
rm server.pass.key
openssl rsa -passin pass:x -in server.pass.key -out server.key

# Generate CSR
openssl req -new -key server.key -out server.csr

# Example config:
# ---------------
# Country Name (2 letter code) []:US
# State or Province Name (full name) []:IN
# Locality Name (eg, city) []:Indianapolis
# Organization Name (eg, company) []:Genesys
# Organizational Unit Name (eg, section) []:PureCloud
# Common Name (eg, fully qualified host name) []:localhost
# Email Address []:pure@genesys.com
# 
# Please enter the following 'extra' attributes
# to be sent with your certificate request
# A challenge password []:

# Generate cert
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

## Running / Development

* `ember serve`
* Visit your app at [https://localhost:4200](https://localhost:4200).


## Specifying a Swagger Definition in the url

The Open API explorer accepts a couple URL parameters for configuration

| Param | Location | Description | Example |
| ----- | -------- | ----------- | ------- |
| openApiUrl | query string | The Url to the open api definition file | https://api.mypurecloud.com/api/v2/docs/swagger |
| host | query string | Overrides the _host_ value in the swagger file  | localhost:8080 |
| schema | query string | Overrides the _schema_ value in the swagger file  | http |
| token_type | url hash | oauth token type to use with authenticated requests | bearer |
| access_token | url hash | oauth access token |  |

token_type and access_token are in the url hash to support oauth redirects.

Assuming that the OpenAPI explorer is hosted at https://developer.mypurecloud.com/developer-tools/#/api-explorer, an example would be:

https://developer.mypurecloud.com/developer-tools/#/api-explorer/?openApiUrl=https://api.mypurecloud.com/api/v2/docs/swagger#token_type=bearer&access_token=Uf7UTEjT9SknXhdUz

## Restrictions

* Currently only supports OAuth2 bearer tokens

## Environment Variable Configuration

| Env Var | Description |
| ------- | ----------- |
| PERMISSIONS_KEY_NAME | property on method to get permission information, permission model looks like ``` { "type": "ANY/ALL", "permissions": [list of permission names]} ``` |
