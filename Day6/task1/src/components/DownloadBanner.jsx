import { downloadPhone, downloadQr, heroContent } from '../data'

function DownloadBanner() {
  return (
    <section className="download-banner">
      <div className="container">
        <div className="download-banner__card">
          <div className="download-banner__copy">
            <h2>Download the app now!</h2>
            <p>
              Experience seamless online ordering
              <br />
              only on the Zomato app
            </p>
            <div className="download-stores">
              {heroContent.downloadStoreLinks.map((store) => (
                <a key={store.name} href={store.url} target="_blank" rel="noreferrer" aria-label={store.name}>
                  <img src={store.badge} alt={store.name} />
                </a>
              ))}
            </div>
          </div>

          <div className="download-banner__phone">
            <img src={downloadPhone} alt="" className="download-banner__frame" aria-hidden="true" />
            <div className="download-banner__qr-wrap">
              <p>Scan the QR code to download the app</p>
              <img src={downloadQr} alt="QR code to download Zomato app" className="download-banner__qr" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DownloadBanner
