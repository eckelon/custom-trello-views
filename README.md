# Custom Trello Views

Simple reactive app to filter trello cards by custom fields

# How To

## Back:

```
python3 -m venv custom-trello-views-env
source custom-trello-views-env/bin/activate
pip install -r requirements.txt
source load-variables.zsh
gunicorn -b 0.0.0.0:5000 app:app
```

## Front:

 ```
 cd js
 npm i
 npm run start # for starting webpack development mode watching files
 npm run build # for building app using webpack production mode
 ```
