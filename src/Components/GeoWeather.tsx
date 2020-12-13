import React from 'react';

const key: string = 'c91bf3538d566f07b339918425cc01f8';

type GeoWeatherState = {
    loc: {
        lat: number | string | undefined;
        lon: number | string | undefined;
    };
    city: string;
    tempC: number | string;
    tempF: number | string;
    icon: any;
    sunrise: any;
    sunset: any;
    errorMessage: string;
};

type AcceptedProps = {
  optionalProp?: string;
};

class GeoWeather extends React.Component<AcceptedProps, GeoWeatherState> {
  constructor(props: AcceptedProps) {
    super(props);
    this.state = {
      loc: {
        lat: 0,
        lon: 0,
      },
      city: "Loading Up",
      tempC: 0,
      tempF: 0,
      icon: undefined,
      sunrise: undefined,
      sunset: undefined,
      errorMessage: 'Get it Right!!',
    };
  }
  getPosition: any = () => {
    return new Promise((resolve: any, reject: any) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  getGeoWeather = async (lat: number, lon: number) => {
    const api_call = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`
    );
    const data = await api_call.json();
    this.setState({
      loc: {
        lat: 0,
        lon: 0,
      },
      city: data.name,
      tempC: Math.round(data.main.temp),
      tempF: Math.round(data.main.temp * 1.8 + 32),
      icon: data.weather[0].icon,
      sunrise: undefined,
      sunset: undefined,
      errorMessage: "Hey can't find you!",
    });
  };
  success(pos: any){
    let cord: any = pos.coords;
  }
  error(err: any){
    console.warn(`ERROR(${err.code}): ${err.message}`)
  }
  componentDidMount() {
  let options = {
    enableHighAcuraacy: true,
    timeout: 5000,
    maximumAge: 0
  }
    console.log('mounted');
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(this.success, this.error, options)
    } else {
      console.log('not available')
    }
    this.getPosition()
      .then((position: any) => {
        this.getGeoWeather(position.coords.latitude, position.coords.longitude);
      })
      .catch((err: any) => {
        this.setState({ errorMessage: err.message });
      });
  }
  render() {
    const { city, tempC, tempF, icon } = this.state;
    return (
      <div className="Weather">
        <div className="weather-container">
          <div>{city}</div>
          <div className="weather-item">
            {tempC} &deg;C <span className="slash">/</span>
            {tempF} &deg;F
          </div>
          <div>
            <img
              className="weather-icon"
              src={`http://openweathermap.org/img/w/${icon}.png`}
              alt="weather icon"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GeoWeather;

