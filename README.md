# Custom Trello Views

Simple reactive app to filter trello cards by custom fields.

This is just an experiment to learn how to use [RxJs](https://github.com/ReactiveX/rxjs) with [Riot.js](https://github.com/riot/riot)

# How To

## Back

It's a [Flask](https://github.com/pallets/flask) application:

```
python3 -m venv custom-trello-views-env
source custom-trello-views-env/bin/activate
pip install -r requirements.txt
source load-variables.zsh
gunicorn -b 0.0.0.0:5000 app:app
```

## Front

 ```
 cd js
 npm i
 npm run start # for starting webpack development mode watching files
 npm run build # for building app using webpack production mode
 ```
