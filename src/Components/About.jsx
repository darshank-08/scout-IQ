import styles from "./About.module.css";
import { FaGithub, FaLinkedin, FaEnvelope, FaGlobe, FaInstagram } from "react-icons/fa";


const About = () => {
  return (
    <div className={styles.aboutContainer}>

      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>About ScoutIQ</h1>
        <p className={styles.heroSub}>
          A data-driven football scouting platform built to analyze, compare,
          and discover players across the top 5 European leagues.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>The Project</h2>
        <p className={styles.text}>
          ScoutIQ is a full-stack player scouting and analytics platform designed
          to bring data intelligence to football recruitment. It aggregates
          performance data for <strong>2,500+ players</strong> across the
          <strong> Premier League, La Liga, Bundesliga, Serie A, </strong>
          and <strong>Ligue 1</strong>, providing scouts, analysts, and enthusiasts
          with deep statistical insight.
        </p>
        <p className={styles.text}>
          The platform features role-based player profiling, interactive radar
          chart comparisons, position-based filtering, and national team squad
          views — all backed by a high-performance REST API with optimized
          query response times.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Tech Stack</h2>
        <div className={styles.stackGrid}>
          <div className={styles.stackCard}>
            <span className={styles.stackLabel}>Frontend</span>
            <span className={styles.stackValue}>React.js, Chart.js, CSS Modules</span>
          </div>
          <div className={styles.stackCard}>
            <span className={styles.stackLabel}>Backend</span>
            <span className={styles.stackValue}>Spring Boot, REST APIs, JPA/Hibernate</span>
          </div>
          <div className={styles.stackCard}>
            <span className={styles.stackLabel}>Database</span>
            <span className={styles.stackValue}>PostgreSQL, Redis</span>
          </div>
          <div className={styles.stackCard}>
            <span className={styles.stackLabel}>Deployment</span>
            <span className={styles.stackValue}>AWS EC2, Vercel, CI/CD</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>The Developer</h2>
        <div className={styles.developerCard}>
          <div className={styles.developerInfo}>
            <h3 className={styles.developerName}>Darshan Karagir</h3>
            <p className={styles.developerRole}>Full-Stack Developer · Backend Focused</p>
            <p className={styles.text}>
              I'm a Java Developer passionate about building
              scalable & Impactful Web applications. ScoutIQ was built entirely
              by me — from database schema design and REST API architecture
              to frontend UI and cloud deployment. This project reflects my
              interest in both software engineering and football analytics.
            </p>
          </div>

          <div className={styles.socialLinks}>
            <a
              href="https://github.com/darshank-08"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaGithub className={styles.socialIcon} />
              <span>github.com/darshank-08</span>
            </a>

            <a
              href="https://www.linkedin.com/in/darshan-karagir/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaLinkedin className={styles.socialIcon} />
              <span>linkedin.com/in/darshan-karagir</span>
            </a>

            <a
              href="mailto:karagirdarshan1@gmail.com"
              className={styles.socialLink}
            >
              <FaEnvelope className={styles.socialIcon} />
              <span>karagirdarshan1@gmail.com</span>
            </a>

            <a
              href="https://www.instagram.com/im_darshannnnn/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <FaInstagram className={styles.socialIcon} />
              <span>instagram.com/im_darshannnnn</span>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data & Disclaimer</h2>
        <p className={styles.text}>
          All player statistics are sourced from publicly available football
          data for the <strong>2024–25 season</strong>. ScoutIQ is an
          independent project built for educational and portfolio purposes.
          It is not affiliated with any football club, league, or official
          scouting organization.
        </p>
      </div>

      <div className={styles.footer}>
        <p>Built with passion for football & code · © {new Date().getFullYear()} Darshan Karagir</p>
      </div>

    </div>
  );
};

export default About;