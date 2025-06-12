"use client";

import "./about.css";

export default function AboutPage() {
  return (
    <div className="about-container">
      {/* Decorative floating hearts */}
      <div className="hearts-decoration">
        <div className="heart">❤</div>
        <div className="heart">❤</div>
        <div className="heart">❤</div>
      </div>

      <div className="about-header">
        <h1 className="about-title">Russana & Dire</h1>
        <p className="about-subtitle">პიპ! პიპ! მოდის სამყარო გელოდება!</p>
      </div>

      <div className="about-section">
        <h2 className="section-title">მოგესალმებით!</h2>
        <p className="about-description">
          გვიხარია, რომ გვეწვიეთ! აქ ყველაფერი განსაკუთრებულია - ჩვენი პიპინა
          ჩანთებიდან დაწყებული, სტილური კაბებით, მაისურებითა და საცურაო
          კოსტიუმებით დამთავრებული. ყველა ნივთი შექმნილია იმისთვის, რომ
          გაგახალისოთ და გაგაღიმოთ!
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-item">
          <h3 className="feature-title">პიპინა დიზაინი</h3>
          <p className="feature-text">სახალისო და უნიკალური კოლექციები</p>
        </div>

        <div className="feature-item">
          <h3 className="feature-title">საუკეთესო ხარისხი</h3>
          <p className="feature-text">
            რჩეული ქსოვილები და გულისყურით შექმნილი
          </p>
        </div>

        <div className="feature-item">
          <h3 className="feature-title">სტილის თავისუფლება</h3>
          <p className="feature-text">იყავი განსხვავებული, იყავი შენი თავი!</p>
        </div>
      </div>

      <div className="about-section">
        <h2 className="section-title">ჩვენი ისტორია</h2>
        <p className="about-description">
          Russana & Dire დაიბადა სიყვარულით მოდისა და სიხალისის მიმართ. ჩვენი
          მიზანია შევქმნათ ისეთი ტანსაცმელი და აქსესუარები, რომლებიც არა მხოლოდ
          ლამაზია, არამედ ღიმილს მოგგვრით და პოზიტიურ განწყობას შეგიქმნით.
          ყოველი პიპიიი არის შეხსენება - ცხოვრება მხიარული და ფერადია!
        </p>
      </div>
    </div>
  );
}
