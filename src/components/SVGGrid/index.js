import React, { Component } from 'react';
import './style.scss';

export default class SVGGrid extends Component {

  /**
   * Renders the BORDER of the GRID
   */
  renderBorder() {
    const {cellSizeInPx, width, height} = this.props;
    const maxX = cellSizeInPx * width;
    const maxY = cellSizeInPx * height;

    return [
        <line x1="0" y1="0" x2={maxX} y2="0" />,
        <line x1="0" y1="0" x2="0" y2={maxY} />,
        <line x1="0" y1="0" x2="0" y2={maxY} />,
        <line x1={maxX} y1={maxY} x2={maxX} y2="0" />,
        <line x1={maxX} y1={maxY} x2="0" y2={maxY} />,
    ];
  }

  /**
   * Renders the LINEs of the GRID
   */
  renderGridLines() {
    const {cellSizeInPx, width, height} = this.props;
    const maxX = cellSizeInPx * width;
    const maxY = cellSizeInPx * height;

    const gridLines = [];

    for(let i = 0; i < width; i++) {
      gridLines.push(
        <line x1="0" y1={i * cellSizeInPx} x2={maxX} y2={i * cellSizeInPx} />
      )
    }
    for(let i = 0; i < height; i++) {
      gridLines.push(
        <line y1="0" x1={i * cellSizeInPx} y2={maxY} x2={i * cellSizeInPx} />
      )
    }

    return gridLines;
  }

  /**
   * Renders the NODEs on the GRID
   */
  renderNodes() {
    const {cellSizeInPx, width, nodes} = this.props;

    if (nodes.length === 0) {
      return;
    }

    const nodeCells = [];

    nodes.forEach((node) => {
      const {X, Y} = node.Location;
      const radius = width + 2.5;
      const cx = (X+1) * cellSizeInPx - radius;
      const cy = (Y+1) * cellSizeInPx - radius;
      const offset = 2.5;
      nodeCells.push(
        <circle
          cx={cx  - offset}
          cy={cy - offset}
          r={radius}
          fill="#aeaeae"
        />
      );
      nodeCells.push(
        <text
          x={cx - offset}
          y={cy - offset}
          text-anchor="middle"
          fill="black"
          font-size="18px"
          font-family="Arial"
          dy=".3em">{node.Value}</text>
      );
    });

    return nodeCells;
  }

  /**
   * Renders the BOTs on the GRID
   */
  renderBots() {
    const {cellSizeInPx, width, bots} = this.props;

    if (bots.length === 0) {
      return;
    }

    const botCells = [];

    bots.forEach((bot) => {
      const {X, Y} = bot.Location;
      const radius = width + 2.5;
      const cx = (X+1) * cellSizeInPx - radius;
      const cy = (Y+1) * cellSizeInPx - radius;
      const offset = 2.5;
      botCells.push(
        <circle
          cx={cx - offset}
          cy={cy - offset}
          r={radius}
          fill="red"
        />
      );
      botCells.push(
        <text
          x={cx - offset}
          y={cy - offset}
          text-anchor="middle"
          fill="white"
          font-size="18px"
          font-family="Arial"
          dy=".3em">{bot.Score}</text>
      );
    });

    return botCells;
  }

  /**
   * A helper function to find a given NODE by it's ID
   */
  findNodeById(id) {
    const {nodes} = this.props;

    let node;
    nodes.forEach((x) => {
      if (x.Id === id) {
        node = x;
      }
    });

    return node;
  }

  /**
   * Draws lines beteen BOTs and any NODEs that they have a claim on
   */
  renderBotClaims() {
    const {cellSizeInPx, width, bots} = this.props;

    const botClaimLines = [];

    bots.forEach((bot) => {
      const {X, Y} = bot.Location;
      const radius = width + 2.5;
      const botX = (X+1) * cellSizeInPx - radius;
      const botY = (Y+1) * cellSizeInPx - radius;

      if (bot.Claims.length === 0) {
        return;
      }
      bot.Claims.forEach((claim) => {
        const node = this.findNodeById(claim);
        const nodeX = (node.Location.X+1) * cellSizeInPx - radius;
        const nodeY = (node.Location.Y+1) * cellSizeInPx - radius;
        botClaimLines.push(
          <line
            className="bot-claim-line"
            x1={botX}
            y1={botY}
            x2={nodeX}
            y2={nodeY}
          />
        );
      });
    });

    return botClaimLines;
  }

  render() {
    const {cellSizeInPx, width, height} = this.props;

    return (
      <svg
        width={width * cellSizeInPx}
        height={height * cellSizeInPx}
      >
        {this.renderBorder()}
        {this.renderGridLines()}
        {this.renderNodes()}
        {this.renderBotClaims()}
        {this.renderBots()}
      </svg>
    );
  }

}
