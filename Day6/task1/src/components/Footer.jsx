import { footerLogo, heroContent, socialLinks } from '../data'

function Footer({ columns }) {
  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer__top">
          <img src={footerLogo} alt="zomato" className="footer__logo" />
        </div>

        <div className="footer__grid">
          {columns.map((column) => (
            <div key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3>Social Links</h3>
            <div className="footer__social">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                  {item.label[0]}
                </a>
              ))}
            </div>
            <div className="footer__stores">
              {heroContent.downloadStoreLinks.map((store) => (
                <a key={store.name} href={store.url} target="_blank" rel="noreferrer" aria-label={store.name}>
                  <img src={store.badge} alt={store.name} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            By continuing past this page, you agree to our Terms of Service, Cookie Policy, Privacy Policy and Content
            Policies. All trademarks are properties of their respective owners.
          </p>
          <p>2008-2024 © Zomato™ Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
