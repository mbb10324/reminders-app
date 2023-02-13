import "./Privacy.css"
import React, {useEffect} from "react"
import Menu from "./Menu.js"
import { MdEmail } from "react-icons/md";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";

function Terms() {
    const goPrivacy = () => {navigate("/Privacy")}
    const goSecurity = () => {navigate("/Security")}
    const navigate = useNavigate();

    useEffect(() => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    })

    return (
        <>
            <div className="privacyContainer">
                <div className="privacyMenu">
                    <Menu />
                </div>
                <div>
                    <h1>Terms</h1>
                    <p>
                        Thank you for visiting the website and mobile apps of RemindersApp Inc.
                        This Privacy Notice provides transparency to what and how we collect
                        and use both non-personally identifiable and personally identifiable
                        information (“Personal Information”) obtained when you visit our websites
                        (“Sites”), mobile apps ("apps"), and widgets; whether on a computer,
                        mobile device, connected TV, or social networking platform. By visiting
                        or using services owned, operated, or provided by "Reminders",
                        you accept the practices described in this Notice.
                    </p>
                    <p>
                        This Notice does not apply to services offered by other companies or individuals,
                        even if a product or site is linked to our Services and even if a relationship
                        exists between us and a third party. This Notice is referenced in "Reminders" Terms
                        of Use agreement, which also governs our Services.
                    </p>
                    <ul>
                        <li>Accessing account information</li>
                        <li>Manage your personal information</li>
                        <li>Your California privacy rights</li>
                        <li> Updates to our privacy notice</li>
                        <li> Contact us/report misconduct</li>
                    </ul>
                </div>
                <div>
                    <h3>
                        1. Types of information we collect
                        Personal Information:
                    </h3>
                    <p>
                        Personal Information: <br />
                        <br />
                        -Name, email address, user credentials, age, gender, address and/or phone
                        number that you voluntarily provide when you participate in any features,
                        activities, or contests on our Services. <br />
                        <br />
                        Non-personal information that cannot be used to identify or contact a
                        specific individual, such as: <br />
                        <br />
                        -Internet Service Provider, IP address, browser, language used and clickstream data <br />
                        <br />
                        Location information: <br />
                        <br />
                        -We may collect and process location data such as GPS, WiFi, or carrier network
                        from your device to provide location-related services.
                    </p>
                </div>
                <div>
                    <h3>
                        2. Use of cookies and web beacons
                    </h3>
                    <p>
                        We use cookies and other technology to deliver our Services, tailor your experience,
                        and deliver customized advertising to you. A cookie is a small text file stored on
                        your device to personalize your experience, recognize repeat visitors, and
                        deliver Services efficiently.
                        We will continue to add new technology to our Services, which may collect information
                        about you and your use of our Services.<br />
                        <br />
                        To disable cookies:<br />
                        <br />
                        You may configure your browser to reject cookies. If you do so, you might not be able
                        to automatically log-in to your account, access important functions, features and
                        activities or enjoy certain conveniences or customized and personalized features
                        of our Site and other Services.
                    </p>
                </div>
                <div>
                    <h3>
                        3. How we use your information to:
                    </h3>
                    <p>
                        -Provide you with our apps and Services<br />
                        -Improve our products and Services, develop new services, and to protect "Reminders", its
                        affiliated businesses, and our users.<br />
                        -Perform analytics<br />
                        -Develop reports regarding usage, activity, and statistics<br />
                        -Comply with applicable laws, regulations, and legal process<br />
                        -Protect our rights, the rights of affiliates or related third-parties, or take appropriate
                        legal action, such as to enforce our TOU.<br />
                        -Keep a record of our transactions and communications<br />
                        -Facilitate the provision of software updates and product support<br />
                        -Improve products and other Services or provide Services or technologies to you<br />
                        -We may use information you provide us, in accordance with applicable laws, to contact you
                        from time to time about important information, required notices and marketing promotions.
                    </p>
                </div>
                <div>
                    <h3>
                        4. Disclosure of Personal Information to Third Parties:
                    </h3>
                    <p>
                        -To provide the Services that you access or request, complete transactions you initiate, or otherwise fulfill your requests<br />
                        -To protect the security of our Services or databases<br />
                        -To implement or enforce our company policies, the Terms of Use, the "Reminders" Copyright Complaint Procedures, or agreements that we may enter into with you<br />
                        -To respond to subpoenas, legal process or government requests or investigations<br />
                        -To act in response to an emergency or situation that threatens the life, health, or security of an individual<br />
                        -To assist in the investigation of a violation (or presumed violation) of law, of if we believe in good faith that the law requires or authorizes such disclosure<br />
                        -In connection with any proposed or actual sale, lease, merger, assignment, reorganization, or financing of all or any portion of "Reminders" or our businesses<br />
                        -Non-personal information collected from you does not identify you personally, and we may disclose non-personal information to third parties for any purpose<br />
                        -Third-party links: If you choose to use any links our Services provide to third parties, you will be leaving our Services and going to a new site or platform. Our Privacy Notice does not apply to services offered by other companies or individuals, even if a product or site is linked to our Services and even if a relationship exists between "Reminders" and a third party. Protection of your privacy at those other sites or platforms will be governed by the privacy policy of that particular site or platform.
                    </p>
                </div>
                <div>
                    <h3>
                        5. Customized content and advertising
                    </h3>
                    <p>
                        We, our operational service providers use cookies and other similar technology to enrich your experience on our Services by serving relevant, tailored, and personalized advertising and/or content. The customizations are based on information you provide to us; your use of our content, features and activities; visits to our Facebook Fan page or use of other Facebook features and services, or other social network platforms, and/or projections made about you based on these elements.
                    </p>
                </div>
                <div>
                    <h3>
                        6. Safeguarding children's privacy
                    </h3>
                    <p>
                        We do not knowingly collect Personal Information or any other identifying data from children younger than age 13. If we discover that a child under age 13 submitted Personal Information to our Site, apps, or other internet-based Services without first obtaining verifiable parental consent, we will immediately reject the entry and delete that information from our database (to the extent technically feasible), unless such information meets an exception under the Children's Online Privacy Protection Act ("COPPA").
                    </p>
                </div>
                <div>
                    <h3>
                        7. Information security
                    </h3>
                    <p>
                        We take steps to protect the security of the Personal Information we collect and use. However, no physical or electronic security system is impenetrable, and we cannot guarantee the security of our servers or databases, nor can we guarantee that the information you supply to us will not be intercepted during online transmission. Use caution when disclosing your Personal Information.
                    </p>
                </div>
                <div>
                    <h3>
                        8. Accessing account information
                    </h3>
                    <p>
                        When requested, we will remove your Personal Information from our active database(s). Contact our Privacy Administrator. To protect your privacy and security, we will take reasonable steps to verify your identity first, such as requiring a password and email address.
                    </p>
                </div>
                <div>
                    <h3>
                        9. Manage your Personal Information
                    </h3>
                    <p>
                        Customized Ads:
                        Non-affiliated third parties are independent from "Reminders". If you wish to receive information about your disclosure choices or stop communications from third parties, you will need to contact the third parties directly.
                    </p>
                </div>
                <div>
                    <h3>
                        10. Updates to our privacy notice
                    </h3>
                    <p>
                        We may change this Privacy Notice from time to time. When updated, we will post the changes to this page and update the “Last Updated” date. By continuing to use this Site or other Services after we post changes, you have accepted the Privacy Notice as modified.
                    </p>
                </div>
            </div >
            <div className="aboutGutter privacyGutter">
                <p>@2023 ReminderApp, inc.</p>
                <div className="SocialIcons">
                    <a className="indivSocialIcons" href="https://fb.me/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                    <a className="indivSocialIcons" href="https://twitter.com/galvanize/" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                    <a className="indivSocialIcons" href="https://instagr.am/GalvanizeHQ/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                    <a className="indivSocialIcons" href="https://www.youtube.com/@Galvanize_HackReactor/videos/" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                    <a className="indivSocialIcons" href="mailto:marketing@galvanize.com" rel="noopener noreferrer"><MdEmail /></a>
                </div>
                <div className="legalLinks">
                <span className="spans" onClick={goPrivacy}>privacy</span>
                <span className="spans" onClick={goSecurity}>security</span>
                </div>
            </div>
        </>
    )
}

export default Terms