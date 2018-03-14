# Microservice test project
Проект состоит из 2-х сервисов
 - Web-API с OAuth2 сервером и базой mongoDB
 - Сервис-данных - REST-API + Postgres
 
Клиент-браузер общается только с Web-API
Предоставляет данные для аутентификации, получает токен
По нему делает запрос на получение/публикацию статей, Web-API проверяет токен, делает запрос второму сервису и возвращает результат клиенту.
## Пример запросов:
##### Получение токена:
POST http://localhost:8080/oauth/token grant_type=password client_id=browser client_secret=secret username=admin password=admin
##### публикация/запрос статьи:
POST http://localhost:8080/api/article author=Ivanov title=Description content=Full_text  Authorization:'Bearer TOKEN'
GET http://localhost:8080/api/articles Authorization:'Bearer TOKEN'
GET http://localhost:8080/api/article/:id Authorization:'Bearer TOKEN'