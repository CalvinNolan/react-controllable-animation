import React, { Component } from 'react';
import PropTypes from 'prop-types';

const emptyFunction = () => {};
const TIME_BETWEEN_FRAMES = 1000 / 10; // 10 FPS

class ControllableAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      animation: this.props.animation,
      currentFrame: this.props.spritesheetDescription.default_frame_position,
      currentLoops: 0,
      hasAnimationLoaded: false,
      hasReachedLoopsLimit: false,
      restartAnimation: false
    };
    this.displayAnimation = this.displayAnimation.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.animation !== this.props.animation) {
      this.setState({
        animation: nextProps.animation
      });
    }

    if (nextProps.status === "play" && this.props.status === "pause") {
      this.setState({
        restartAnimation: true
      });
    }

    if (!isNaN(nextProps.loops) && nextProps.loops !== this.props.loops) {
      if (this.state.hasReachedLoopsLimit) {
        this.setState({
          currentLoops: 0,
          hasReachedLoopsLimit: false,
          restartAnimation: true
        });
      } else {
        this.setState({
          currentLoops: 0,
          hasReachedLoopsLimit: false,
        });
      }
    }
  }  

  componentWillUpdate(nextProps, nextState) {
    if (!this.state.hasAnimationLoaded && nextState.hasAnimationLoaded) {
      this.props.onLoad();
      this.beginAnimation();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.restartAnimation) {
      this.setState({
        restartAnimation: false
      });
      this.beginAnimation();
    }
  }

  getCurrentAnimationDetails() {
    const { animation } = this.state;
    const { spritesheetDescription } = this.props;
    return spritesheetDescription.animation_description[animation];
  }

  getTimeBetweenFrames() {
    const { speed } = this.props;
    if (speed > 0) {
      return TIME_BETWEEN_FRAMES / speed;
    } 
    return TIME_BETWEEN_FRAMES;
  }

  hasReachedLoopsLimit() {
    const { loops } = this.props; 
    if (loops > 0) {
      if (this.state.currentLoops >= loops && !this.state.hasReachedLoopsLimit) {
        this.setState({
          hasReachedLoopsLimit: true
        });
        this.props.onLoopComplete();
        return true;
      }
    }
    return this.state.hasReachedLoopsLimit;
  }

  beginAnimation() {
    if (!this.hasReachedLoopsLimit()) {
      setTimeout(() => {
        const { frames, first_frame_position, climax } = this.getCurrentAnimationDetails()
        let newFrame = this.state.currentFrame + 1; 
        if (newFrame >= (first_frame_position + frames) || newFrame < first_frame_position) {
          newFrame = first_frame_position;
          this.setState({
            currentLoops: this.state.currentLoops + 1
          });
        }
        this.setState({
          currentFrame: newFrame,
        });

        if (climax !== undefined && climax === newFrame) {
          this.props.onAnimationClimax();
        }

        if (this.props.status !== 'pause') {
          this.beginAnimation();
        }
      }, this.getTimeBetweenFrames());
    }
  }

  displayAnimation({ target: img }) {
    const { spritesheetDescription } = this.props;
    const frameWidth = spritesheetDescription.frame_width;
    const frameHeight = spritesheetDescription.frame_height;

    const framesPerRow = Math.floor(img.offsetWidth / frameWidth);
    const noOfRows = Math.floor(img.offsetHeight / frameHeight);

    this.setState({
      hasAnimationLoaded: true,
      spritesheetHeight: img.offsetHeight,
      spritesheetWidth: img.offsetWidth,
      framesPerRow,
      noOfRows
    });
  }

  getBackgroundYOffset() {
    const { currentFrame, framesPerRow } = this.state;
    const frameHeight = this.props.spritesheetDescription.frame_height;
    return Math.floor((currentFrame - 1) / framesPerRow) * frameHeight * -1;
  }

  getBackgroundXOffset() {
    const { currentFrame, framesPerRow } = this.state;
    const frameWidth = this.props.spritesheetDescription.frame_width;
    return ((currentFrame - 1) % framesPerRow) * frameWidth * -1;
  }

  renderSpritesheetLoader() {
    const { spritesheet, animation } = this.props;
    return (
      <span>
        <p>LOADING</p>
        <img
          style={{opacity: 0}}
          ref={spritesheet => { this.spritesheet = spritesheet }}
          src={spritesheet}
          onLoad={this.displayAnimation}
          alt={`${animation} animation`}
        />
      </span>
    );
  }

  renderAnimation() {
    const { spritesheetDescription } = this.props;
    const frameWidth = spritesheetDescription.frame_width;
    const frameHeight = spritesheetDescription.frame_height;

    return (
      <div 
        ref={spritesheet => { this.spritesheet = spritesheet; }}
        style={{ 
          width: frameWidth, 
          height: frameHeight, 
          background: `url(${this.props.spritesheet})`,
          backgroundPosition: `${this.getBackgroundXOffset()}px ${this.getBackgroundYOffset()}px`
        }}
      />
    );
  }

  render() {
    const { spritesheetDescription } = this.props;
    const { currentFrame, hasAnimationLoaded } = this.state;

    return (
      <span>
        {hasAnimationLoaded ? this.renderAnimation() : this.renderSpritesheetLoader()}
      </span>
    );
  }
}

ControllableAnimation.propTypes = {
  spritesheet: PropTypes.string.isRequired,
  spritesheetDescription: PropTypes.object.isRequired,
  animation: PropTypes.string,
  onLoad: PropTypes.func,
  status: PropTypes.oneOf(['play', 'pause']),
  speed: PropTypes.number,
  loops: PropTypes.number,
  onLoopComplete: PropTypes.func,
  onAnimationClimax: PropTypes.func,
};

ControllableAnimation.defaultProps = {
  animation: 'default',
  onLoad: emptyFunction,
  status: 'play',
  speed: 1,
  loops: 0,
  onLoopComplete: emptyFunction,
  onAnimationClimax: emptyFunction
};

export default ControllableAnimation;
