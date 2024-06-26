import { Map } from './UI/Map';

class LoadedPlace {
  constructor(coordinates, address) {
    new Map(coordinates);
    const headerTitle = document.querySelector('header h1');
    headerTitle.textContent = address;
  }
}

const url=new URL(location.href)

const queryParams=url.searchParams;

const coords={
    lat:+queryParams.get("lat"),
    lng:parseFloat(queryParams.get("lng"))
}

const address=queryParams.get("address")

new LoadedPlace(coords,address);

