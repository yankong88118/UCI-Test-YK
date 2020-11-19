# import
from flask import Flask,jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import datetime as dt


#database set-up
engine = create_engine("sqlite:///Resources/hawaii.sqlite",echo=False)
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()
measurement=Base.classes.measurement
station=Base.classes.station
session = Session(engine)

# Create an app, being sure to pass __name__
app = Flask(__name__)


#  Define what to do when a user hits the index route
@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/start_date<br/>"
        f"/api/v1.0/start_date/end_date<br/>"
    )

#precipitation
@app.route("/api/v1.0/precipitation")
def precipitation():
    last_record=session.query(measurement).order_by(measurement.date.desc()).first().date
    year_ago_date=dt.datetime.strptime(last_record,'%Y-%m-%d') - dt.timedelta(days=365)
    scores=session.query(measurement.date, measurement.prcp).\
        filter(measurement.date>=year_ago_date).all()
    session.close()

    # Create a dictionary
    prcp_data = dict(scores)
    return jsonify(prcp_data)

#station
@app.route("/api/v1.0/stations")
def Station():
    station_data=session.query(station.station,station.name).order_by(station.station).all()
    return jsonify(station_data)

#temperature
@app.route("/api/v1.0/tobs")
def temperature():
    #find the most active station
    most_active_station=session.query(measurement.station,station.name,func.count(measurement.station)).\
    group_by(measurement.station).\
    order_by(func.count(measurement.station).desc()).first()
    #find the last record date for the most active station
    last_date=session.query(measurement).order_by(measurement.date.desc()).\
        filter(measurement.station==most_active_station.station).first().date
    #calculate the last year
    last_year=dt.datetime.strptime(last_date,'%Y-%m-%d') - dt.timedelta(days=365)
    #gather the most active station date for last year
    most_active_station_data=session.query(measurement.date, measurement.tobs).\
        filter(measurement.station==most_active_station.station).\
        filter(measurement.date>=last_year).all()
    return jsonify(most_active_station_data)

#start
@app.route("/api/v1.0/<start_date>")
def calc_temps_start(start):
    sel=[func.min(measurement.tobs), func.max(measurement.tobs), func.avg(measurement.tobs)]
    start_date_data=session.query(*sel).\
       filter(measurement.date>=start).all()
    return jsonify(start_date_data)

#start and end
@app.route("/api/v1.0/<start_date>/<end_date>")
def calc_temps(start_date, end_date):
    select=[func.min(measurement.tobs), func.max(measurement.tobs), func.avg(measurement.tobs)]
    start_to_end=session.query(*select).\
        filter(measurement.date>=start_date).\
       filter(measurement.date<=end_date).all()
    return jsonify(start_to_end)

if __name__ == '__main__':
    app.run(debug=True)



