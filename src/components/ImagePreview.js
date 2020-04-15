import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export default class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: null,
    };

    this.props.handleLoader();
  }

  render() {
    return (
      <div className="image-preview">
        <div className="row">
          <Carousel>
            {this.props.images.map((image, index) => {
              return (
                <div key={index}>
                  <img
                    alt={image.name}
                    style={{
                      maxWidth: "70%",
                      width: "auto",
                      height: "auto",
                    }}
                    src={image.url}
                  />
                  <p className="legend">
                    {image.name}- {image.value}
                  </p>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    );
  }
}
