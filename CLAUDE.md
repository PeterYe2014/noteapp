# CLAUDE.md

This document provides guidance for AI assistants working on the noteapp codebase.

## Project Overview

**noteapp** is a voice-based note-taking application that allows users to record information using voice input. The project is in its early development stage.

### Current Status

This is a greenfield project at the initial setup phase:
- No source code has been written yet
- Technology stack has not been finalized
- Architecture decisions are pending

## Repository Structure

```
noteapp/
├── CLAUDE.md          # AI assistant guidelines (this file)
└── README.md          # Project description
```

## Development Guidelines

### Getting Started

Since this project is in early development, the first steps involve:
1. Defining the technology stack (language, framework, platform)
2. Setting up the project structure and build tools
3. Configuring development environment (linting, testing, etc.)

### Recommended Technology Considerations

For a voice-based note application, consider:
- **Audio/Voice APIs**: Web Audio API, MediaRecorder API, or native mobile APIs
- **Speech-to-Text**: Web Speech API, or cloud services (Google Cloud Speech, AWS Transcribe, etc.)
- **Storage**: Local storage, IndexedDB (web), or cloud storage for notes
- **Framework Options**: React/Next.js (web), React Native (mobile), Electron (desktop)

## Code Conventions

When code is added to this project, follow these conventions:

### General Principles
- Write clear, self-documenting code
- Keep functions small and focused on a single responsibility
- Use meaningful variable and function names
- Add comments only for complex logic that isn't self-evident

### File Organization
- Group related files by feature or domain
- Keep configuration files in the project root
- Place source code in a `src/` directory
- Place tests alongside source files or in a `__tests__` directory

### Commit Messages
- Use imperative mood ("Add feature" not "Added feature")
- Keep the first line under 72 characters
- Include context in the body when needed

## Build and Development Commands

*To be defined once the project is set up*

Example structure for future reference:
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## Testing Strategy

*To be established during project setup*

Recommended approach:
- Unit tests for core logic
- Integration tests for audio/voice features
- End-to-end tests for critical user flows

## Key Features to Implement

Based on the project description, core functionality should include:
1. **Voice Recording**: Capture audio input from the user
2. **Speech-to-Text**: Convert voice recordings to text notes
3. **Note Management**: Create, read, update, and delete notes
4. **Note Organization**: Categories, tags, or folders for notes
5. **Search**: Find notes by content or metadata

## Special Considerations

### Audio/Voice Features
- Handle microphone permissions gracefully
- Provide visual feedback during recording
- Support multiple audio formats
- Consider offline functionality

### Privacy and Security
- Audio data may be sensitive - handle appropriately
- If using cloud speech-to-text, inform users about data transmission
- Consider local-first architecture for privacy

### Accessibility
- Provide visual alternatives to audio feedback
- Support keyboard navigation
- Ensure screen reader compatibility

## AI Assistant Guidelines

When working on this codebase:

1. **Understand Context**: Read relevant files before making changes
2. **Minimal Changes**: Make only the changes necessary to complete the task
3. **No Over-Engineering**: Avoid adding features or abstractions not requested
4. **Test Changes**: Run tests if available before committing
5. **Clear Commits**: Write descriptive commit messages explaining the "why"

### Common Tasks

- **Adding a new feature**: Create necessary files, update imports, add tests
- **Fixing bugs**: Identify root cause, make minimal fix, verify with tests
- **Refactoring**: Ensure tests pass before and after changes
