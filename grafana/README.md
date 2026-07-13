# Setup grafana

## Create a user
On the first launch, **you must** define a new password.

By default you have :
login: `admin`
password: `admin`

## Add a data source
Type: `prometheus`
Link: `http://prometheus:9090`

## Import dashboard
Create new dashboard with importing then with `dashboard.json` file.
