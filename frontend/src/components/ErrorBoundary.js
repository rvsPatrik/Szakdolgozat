import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(/* error */) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 20,
          margin: 20,
          borderRadius: 6,
          background: '#fff3f3',
          color: '#611',
          border: '1px solid #f5c2c2',
        }}>
          Something went wrong. Please refresh the page or contact support.
        </div>
      );
    }
    return this.props.children;
  }
}