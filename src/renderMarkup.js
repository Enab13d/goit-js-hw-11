export default function renderMarkup(data) {
    const {
      data: { hits },
    } = data;
    const markup = hits
      .flatMap(
        ({
          largeImageURL,
          tags,
          webformatURL,
          likes,
          views,
          comments,
          downloads,
        }) => `<a href ='${largeImageURL}' title='${tags}'><div class="photo-card">
      <img src='${webformatURL}' alt='${tags}' loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes</b>
          ${likes}
        </p>
        <p class="info-item">
          <b>Views</b>
          ${views}
        </p>
        <p class="info-item">
          <b>Comments</b>
          ${comments}
        </p>
        <p class="info-item">
          <b>Downloads</b>
          ${downloads}
        </p>
      </div>
    </div></a>`
      )
      .join('');
    return markup;
  }