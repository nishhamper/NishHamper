import React from "react";
import img1 from "../assets/images/1.png";
import img2 from "../assets/images/2.png";
import img3 from "../assets/images/3.png";
import img4 from "../assets/images/252.jpg";

const team = [
  {
    name: "Neha Chapagain Sharma",
    role: "Creative Director",
    quote: "Every gift should whisper something beautiful.",
    img: img1,
  },
  {
    name: "Jaspreet Kaur",
    role: "Community Director",
    quote: "We build happiness bridges.",
    img: img2,
  },
  {
    name: "Suraj Thakur",
    role: "Tech Director",
    quote: "Even emotion deserves clean code.",
    img: img3,
  },
  {
    name: "Ranjan BK",
    role: "Operations Director",
    quote: "Every delivery is a story, not a shipment.",
    img: img4,
  },
];

const About = () => {
  return (
    <div className="bg-light text-dark">
      {/* Hero Section */}
      <section className="container py-5">
        <div className="row align-items-center justify-content-center text-center">
          <div className="col-md-8">
            <h1 className="display-4 fw-bold text-primary mb-4">Nish Hamper</h1>
            <p className="lead">
              We don't just deliver gifts — we deliver memories. At Giftly, we
              turn moments into experiences with curated collections for every
              emotion and every occasion.
            </p>
          </div>

          {/* <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1607082349560-d368b1d51359?auto=format&fit=crop&w=800&q=80"
              className="img-fluid rounded-4 shadow"
              alt="Giftly"
            />
          </div> */}
        </div>
      </section>

      {/* <section className="bg-white py-5 text-center">
        <div className="container">
          <h2 className="text-primary fw-bold mb-4">Our Mission</h2>
          <p className="lead mx-auto" style={{ maxWidth: "700px" }}>
            To redefine gifting as a language of love, gratitude, and expression.
            With every curated box, we help people connect more meaningfully —
            from birthdays and weddings to the everyday “thank you.”
          </p>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="container py-5">
        <h2 className="text-warning fw-bold mb-5">Board of Members</h2>
        {team.map((member, i) => (
          <div className={`row align-items-center mb-5 ${i % 2 === 1 ? "flex-row-reverse" : ""}`} key={i}>
            <div className="col-md-4 text-center mb-3 mb-md-0">
              <img
                src={member.img}
                className="rounded-circle shadow img-fluid"
                alt={member.name}
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
            </div>
            <div className="col-md-8">
              <h3>
                {member.name}{" "}
                <small className="text-muted">— {member.role}</small>
              </h3>
              <p className="mt-3">
                {i === 0 &&
                  "The soul behind our whimsical designs and heartfelt creations. Neha sees beauty in the tiniest details and brings every gift idea to life with her unmatched artistic flair. From color palettes to packaging magic, she makes sure every Giftly gift feels like a page from someone’s personal story."}
                {i === 1 &&
                  "Warm, witty, and full of love — Jaspreet is the voice you hear when you reach out to Giftly. From managing customer experiences to building a kind gifting community, she ensures every buyer feels like they’re gifting joy, not just products."}
                {i === 2 &&
                  "Suraj combines tech brilliance with emotional intelligence. He builds the digital bridges that ensure your experience with us is smooth, fast, and delightful. From app performance to backend systems — he's the engine under our hood."}
                {i === 3 &&
                  "Ranjan is the calm in the storm. From logistics to last-mile delivery, he ensures everything runs like a Swiss watch. Every gift you receive on time — it’s because of his sharp focus on operations."}
              </p>
              <blockquote className="blockquote text-secondary fst-italic mt-3">
                “{member.quote}”
              </blockquote>
            </div>
          </div>
        ))}
      </section>

      {/* Categories Section */}
      <section className="bg-light py-5">
        <div className="container my-5">
          {/* For Couples */}
          <div className="category-section mb-5">
            <h2 className="category-title">💕 For The Soulmates</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <img
                    src="https://prestigehaus.com/media/magefan_blog/unique-and-elegant-engagement-gifts-for-couples.jpg"
                    className="card-img-top"
                    alt="Couples Experience Voucher"
                    style={{ height: "250px", objectFit: "cover" }}

                  />
                  <div className="card-body">
                    <h5 className="card-title">✨🍷 Couples Experience Voucher</h5>
                    <p className="card-text">
                      Pottery | Candle-Making | Paint & Sip | Wine Tasting<br />
                      <strong>Price:</strong> $39.90 AUD
                    </p>
                    <p>Celebrate love with a shared adventure! Includes scroll message & booking QR.</p>
                    <span className="badge bg-success">Returns Accepted</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <img
                    src="https://www.jewlr.com/au/product-img/JWLN0424.jpg?dim=650&view=np&sku=10KR&ef=GlamorousStrong&e1=Ashley&e0&ch=14F10KRDC"
                    className="card-img-top"
                    alt="Custom Necklace"
                    style={{ height: "250px", objectFit: "cover" }}

                  />
                  <div className="card-body">
                    <h5 className="card-title">💍🌸 Name in My Heart Necklace</h5>
                    <p className="card-text">
                      Gold or Silver | Personalized | Handmade<br />
                      <strong>Price:</strong> $550.10 AUD
                    </p>
                    <p>Includes jewelry card: “You're My Forever Person”.</p>
                    <span className="badge bg-success">Returns Accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Celebrations */}
          <div className="category-section mb-5">
            <h2 className="category-title">🎉 For Celebrations</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <img
                    src="https://i.etsystatic.com/38423500/r/il/9de446/5968380196/il_1588xN.5968380196_a1h1.jpg"
                    className="card-img-top"
                    alt="Wooden Puzzle Toy"
                    style={{ height: "250px", objectFit: "cover" }}

                  />
                  <div className="card-body">
                    <h5 className="card-title">🌟 Personalized Wooden Puzzle Toy</h5>
                    <p className="card-text">
                      Customizable | Safe & Non-toxic<br />
                      <strong>Price:</strong> $29.90 AUD
                    </p>
                    <p>Boost creativity & motor skills. Comes in eco-box.</p>
                    <span className="badge bg-success">Returns Accepted</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <img
                    src="https://i.etsystatic.com/44828381/r/il/8a250b/5203132610/il_1588xN.5203132610_ck92.jpg"
                    className="card-img-top"
                    alt="Kid’s Clothing"
                    style={{ height: "250px", objectFit: "cover" }}

                  />
                  <div className="card-body">
                    <h5 className="card-title">👕 Customized Kid’s Clothing</h5>
                    <p className="card-text">
                      Organic Cotton | Playful Designs<br />
                      <strong>Price:</strong> From $29.90 AUD
                    </p>
                    <p>Choose onesies, tees, or hats with cute themes.</p>
                    <span className="badge bg-success">Returns Accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* For Everyday Heroes */}
          <div className="category-section">
            <h2 className="category-title">👩‍🏫 For Everyday Heroes</h2>
            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100">
                  <img
                    src="https://i.etsystatic.com/56046573/r/il/fbdc4a/6509684623/il_1588xN.6509684623_iis9.jpg"
                    className="card-img-top"
                    alt="Plant Buddy Kit"
                    style={{ height: "250px", objectFit: "cover" }}

                  />
                  <div className="card-body">
                    <h5 className="card-title">🌱 Plant Buddy Kit</h5>
                    <p className="card-text">
                      Basil | Lavender | Sunflower | Self-care<br />
                      <strong>Price:</strong> $59.90 AUD
                    </p>
                    <p>Includes pot, seeds, care card & kraft gift box.</p>
                    <span className="badge bg-success">Returns Accepted</span>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100">
                  <img
                    src="https://i.etsystatic.com/19361583/r/il/e4e2fc/6647763096/il_1588xN.6647763096_o53c.jpg"
                    className="card-img-top"
                    alt="Legacy Journal"
                    style={{ height: "250px", objectFit: "cover" }}

                  />
                  <div className="card-body">
                    <h5 className="card-title">📔 Legacy Journal</h5>
                    <p className="card-text">
                      Mentorship | Reflection | Farewells<br />
                      <strong>Price:</strong> $64.90 AUD
                    </p>
                    <p>Elegant journal with gold-quote & personal note.</p>
                    <span className="badge bg-success">Returns Accepted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-white text-center py-4 border-top">
        <div className="container">
          <small className="text-muted">
            © {new Date().getFullYear()} Giftly · Designed to Deliver Delight ✨
          </small>
        </div>
      </footer> */}
    </div>
  );
};

export default About;
