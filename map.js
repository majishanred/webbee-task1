async function initMap() {
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;

  clearMapNode();
  const map = new YMap(
    document.getElementById('map'),

    {
      location: {
        center: [20.539817, 54.722352],

        zoom: 18,
      },
    },
  );

  map.addChild(new YMapDefaultSchemeLayer());

  map.addChild(new YMapDefaultFeaturesLayer());

  const content = document.createElement('section');

  const marker = new YMapMarker(
    {
      coordinates: [20.539817, 54.722352],
      draggable: false,
    },
    content,
  );

  map.addChild(marker);
  content.style =
    'width: 25px; height: 25px; border-radius: 9999px; background-color: red; position: relative; top: -12.5px; left: -12.5px';
}

function clearMapNode() {
  const elem = document.getElementById('map');
  elem.innerHTML = null;
}

window.addEventListener('finishedLoading', (e) => {
  window.location.hash === '#map' ? initMap() : false;
});
