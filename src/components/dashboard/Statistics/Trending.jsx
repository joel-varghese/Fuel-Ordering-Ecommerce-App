import Carousel from "react-elastic-carousel";
import {useRef} from "react";

function createData(id,trends) {
  return { id,trends };
}

const rows = [
  createData("1", "We have an exciting offer for 10% on any purchase"),
  createData("2", "Do visit our expo in Los Angeles "),
  createData("3", "Get free refuel on desired ranges / FBO's"),
  createData("4", "Well - time pass"),
  createData("5", "Enjoy New York Best bars with offers"),
  createData("6", "Let us party wherever possible"),
  createData("7", "Get a free ride !"),
  createData("8", "We have an exciting offer for 10% on any purchase"),
  createData("9", "Do visit our expo in Los Angeles "),
  createData("10", "Get free refuel on desired ranges / FBO's"),
  createData("11", "Well - time pass"),
  createData("12", "Enjoy New York Best bars with offers"),
  createData("13", "Let us party wherever possible"),
  createData("14", "Get a free ride !"),
];

export function Trending() {
  const carouselRef = useRef(null);
  const totalPages = Math.ceil(7/ 1);
  let resetTimeout;
  return (
    <div>
      <Carousel
    ref={carouselRef}
    enableAutoPlay={true}
    showArrows={false}
    itemPadding={[0, 20]}
    outerSpacing={60}
        autoPlaySpeed={3000}
        verticalMode={true}
    itemsToShow={5}
    onNextEnd={({ index }) => {
        clearTimeout(resetTimeout)
        if (index + 1 === totalPages) {
            if (carouselRef?.current?.goTo) {
                resetTimeout = setTimeout(() => {
                    if (carouselRef?.current?.goTo) {
                        carouselRef.current.goTo(0)
                    }
                }, 3000)
            }
        }
    }}>
        {rows.map((row) => (
          <div key={row.id}>{row.trends}<hr/><br/></div>
        ))}
      </Carousel>
    </div>
  );
}
