initMap();

async function initMap() {
  // Промис `ymaps3.ready` будет зарезолвлен, когда загрузятся все компоненты основного модуля API
  await ymaps3.ready;

  const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = ymaps3;

  clearMapNode();
  // Иницилиазируем карту
  const map = new YMap(
    // Передаём ссылку на HTMLElement контейнера
    document.getElementById('map'),

    // Передаём параметры инициализации карты
    {
      location: {
        // Координаты центра карты
        center: [20.539817, 54.722352],

        // Уровень масштабирования
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
