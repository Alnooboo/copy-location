import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress, getAddressFromCoords } from './Utility/Location';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');
    this.shareBtn = document.getElementById('share-btn');

    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    this.shareBtn.addEventListener('click', this.sharePlaveHandler);
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  sharePlaveHandler() {
    const sharedLinkInputElement = document.getElementById('share-link');

    if (!navigator.clipboard) {
      sharedLinkInputElement.select();
      return;
    }

    navigator.clipboard
      .writeText(sharedLinkInputElement.value)
      .then(() => {
        alert('Copied into clipboard');
      })
      .catch((err) => {
        console.log(err);
        sharedLinkInputElement.select();
      });
  }

  selectPlace(coordinates, address) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }

    this.shareBtn.disabled = false;
    const sharedLinkInput = document.getElementById('share-link');
    sharedLinkInput.value = `${location.origin}/my-place?address=${encodeURI(
      address
    )}&lat=${coordinates.lat}&lng=${coordinates.lng}`;
  }

  locateUserHandler() {
    if (!navigator.geolocation) {
      alert(
        `Location feature is not available in your browser - use modern one or manually write your address`
      );
      return;
    }

    const modal = new Modal(
      'loading-modal-content',
      'Loading location-please wait!'
    );
    modal.show();

    navigator.geolocation.getCurrentPosition(
      async (successHandler) => {
        const coordinates = {
          lat: successHandler.coords.latitude,
          lng: successHandler.coords.longitude,
        };
        const address = await getAddressFromCoords(coordinates);

        modal.hide();

        this.selectPlace(coordinates, address);
      },
      (errorHandler) => {
        modal.hide();
        alert(
          `Couldn't locate your address, please enter the address manually`
        );
      }
    );
  }

  async findAddressHandler(event) {
    event.preventDefault();
    const address = event.target.querySelector('input').value;

    if (!address || address.trim().length === 0) {
      alert('Please enter a valid address');
      return;
    }

    const modal = new Modal(
      'loading-modal-content',
      'Loading location-please wait!'
    );
    modal.show();

    try {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates, address);
    } catch (err) {
      alert(err.message);
    } finally {
      modal.hide();
    }
  }
}

new PlaceFinder();
