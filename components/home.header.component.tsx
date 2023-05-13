import Barcode from "@/assets/barcode.png"
import Background from "@/assets/background.png"
import styles from "@/styles/header.module.scss"
import Image from "next/image"

function HeaderComponent() {
  return (
    <div className={styles.base}>
      <div className={styles.background}>
        <Image src={Background} priority alt="background-gradient-img" />
      </div>

      <div className={styles.title}>
        <h1>
          <i>ARTIFICE</i>
        </h1>
        <Image src={Barcode} alt="barcode" priority />
      </div>

      <div className={styles.content}>
        <p>
          An exploration into the boundary separating the organic from the
          artificial.
          <br />
          <br />
          It may be a clever trickery of the real thing, a mere duplication of the
          artistry that leaves us in awe. But is it really forgery? With
          its digital brushstrokes and algorithmic pixelations, AI generated art
          challenges our very perception of what constitutes art.
          <br />
          <br />
          <span style={{ fontWeight: 500, fontStyle: "italic" }}>
            Artifice
          </span>{" "}
          is a testament to such potential.
        </p>
      </div>
    </div>
  )
}

export default HeaderComponent
