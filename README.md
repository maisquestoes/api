# MaisQuestões

[![Join the chat at https://gitter.im/maisquestoes/api](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/maisquestoes/api?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/maisquestoes/api.svg?branch=master)](https://travis-ci.org/maisquestoes/api)
[![Coverage Status](https://coveralls.io/repos/maisquestoes/api/badge.svg)](https://coveralls.io/r/maisquestoes/api)
[![Deployment status from dploy.io](https://maisquestoes.dploy.io/badge/88313865961412/31644.svg)](http://dploy.io)
[![Dependency Status](https://gemnasium.com/maisquestoes/api.svg)](https://gemnasium.com/maisquestoes/api)


## Api

All requests should be used with ```x-www-form-urlencoded```

We have a default response

```JavaScript
{
  's': 0,                       //Negative number means a error
  'm': 'Message of response',   //When error occurred a error message goes here
  'o': {'object': 'returned'}
}
```

#### Authentication

**/auth/sighup**

**POST**

Request:

|Field|Description|
|---|---|
|name|Name of user|
|email|Email used to receive notifications|

Response:
```JSON
name = example &
email = example@email.com
```
**/auth/sighinFacebook**

**/auth/signin**

#### Authorization

When you signin you will receive a APIKEY that should be used to authorizationin header of http requests.

```
access_token: { APIKEY }
```

#### Subjects
*/subjects**
