// /reading/:id
export default function Reading() {
  return (
    <>
      <main
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <section
          style={{
            border: "1px solid red",

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* /\/\/\ Viršutinė dalis, pavadinimai ir mygtukai */}
          <header
            style={{
              border: "1px solid red",

              width: "1000px",

              margin: "30px 0",

              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div>
              {/* Dėl 'contentEditable' abiems reikės turėti useState, todėl yra 2 error'ai */}
              <h1 contentEditable="true">
                Research suggests that timed tests cause math anxiety
              </h1>
              <h4 contentEditable="true">JO BOALER</h4>
            </div>
            <button>🔓</button> {/* Atrakinti/užkrakinti koregavimą (toggle) */}
            <button>📤</button> {/* Išsaugoti pakeitimus */}
            <input name="zen-mode" type="checkbox" />
            <input name="day-night-mode" type="checkbox" />
            <button>🔖</button> {/* Title ir Author atrakinti */}
          </header>

          {/* /\/\/\ Dokumento dalis */}
          <embed
            src="./assets/videos/test.pdf"
            width="1000px"
            height="1100px"
            type="application/pdf"
          />
        </section>

        {/*  /\/\/\ Užrašų ir žymių vieta */}
        <section
          style={{
            height: "1212px",

            border: "1px solid red",

            margin: "0 10px",

            overflowY: "scroll",
          }}
        >
          <h2>Annotations</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-start",
            }}
          >
            <button>🔓</button>
            <button>📤</button>
            <button>➕</button>
            <button>❌</button> {/* Uždaryti? */}
          </div>
          <ul
            style={{
              minWidth: "200px",
              maxWidth: "350px",
            }}
          >
            <li
              style={{
                marginBottom: "15px",
                paddingLeft: "5px",

                listStyle: "none",
              }}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cupiditate optio nesciunt blanditiis sunt alias rem deserunt,
              libero dolores eum vitae?
            </li>
            <li
              style={{
                marginBottom: "15px",
                paddingLeft: "5px",

                listStyle: "none",
              }}
            >
              Sed aliquam neque eget mi tempor, vitae fermentum mi placerat. Nam
              nunc lectus, elementum interdum vulputate ac, imperdiet sed nunc.
            </li>
            <li
              style={{
                marginBottom: "15px",
                paddingLeft: "5px",

                listStyle: "none",
              }}
            >
              Mollis per fames mus, quisque donec potenti. Ipsum fermentum est
              lobortis per varius a? Efficitur scelerisque rhoncus cubilia amet,
              mi montes iaculis duis lacinia.
            </li>
            <li
              style={{
                marginBottom: "15px",
                paddingLeft: "5px",

                listStyle: "none",
              }}
            >
              Lacus donec justo conubia gravida magna ultrices scelerisque.
              Inceptos torquent hendrerit leo sapien consequat pellentesque. Nam
              tortor semper donec sagittis enim nam mus. Libero enim nascetur
              cursus parturient, turpis vulputate dis. Non conubia ante eros at
              pellentesque vehicula. Potenti tristique augue a dui urna netus
              aliquam diam. Mus donec sapien potenti amet orci integer. Faucibus
              mollis placerat; sem blandit curae nascetur. Ut pellentesque
              feugiat himenaeos consectetur etiam faucibus faucibus.
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
