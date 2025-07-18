import { MdOutlineEmail } from "react-icons/md";
import { SlSocialGithub } from "react-icons/sl";
import { TiSocialFacebookCircular } from "react-icons/ti";
import "../../Page/PackageMemberShip/MainPack.css";
function Footer() {
    return (
         <div>
                <footer className="footer">
                  <div className="social-links">
                    <a href="https://www.facebook.com/profile.php?id=61568079718310" target="_blank" className="social-icon facebook">
                      <i className="fab fa-facebook"><TiSocialFacebookCircular /></i> Facebook
                    </a>
                    <a href="https://github.com/sut67/team08" target="_blank" className="social-icon github">
                      <i className="fab fa-github"><SlSocialGithub /></i> GitHub
                    </a>
                    <a href="mailto:jakkapanjarcunsook@gmail.com" className="social-icon email">
                      <i className="fas fa-envelope"><MdOutlineEmail /></i> Email
                    </a>
                  </div>
                  <p>&copy; 2021 AQUA WASH Co</p>    
                </footer>
              </div>
    );

}export default Footer;