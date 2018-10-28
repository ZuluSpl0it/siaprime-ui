# SiaPrime-UI Spd lifecycle specification

## Introduction

The purpose of this spec is to outline the desired behaviour of SiaPrime-UI as it relates to starting, stopping, or connecting to an existing Siad.

## Desired Functionality

- SiaPrime-UI should check for the existence of a running daemon on launch, by calling `/daemon/version` using the UI's current config.
If the daemon isn't running, SiaPrime-UI should launch a new spd instance, using the bundled spd binary.  If a bundled binary cannot be found, prompt the user for the location of their `spd`.  Siad's lifetime should be bound to SiaPrime-UI, meaning that `/daemon/stop` should be called when SiaPrime-UI is exited.
- Alternatively, if an instance of `spd` is found to be running when SiaPrime-UI starts up, SiaPrime-UI should not quit the daemon when it is exited.

This behaviour can be implemented without any major changes to the codebase by leveraging the existing `detached` flag.

## Considerations

- Calling `/daemon/version` using the UI's config does not actually tell you whether or not there is an active `spd` running on the host, since a different `spd` instance could be running using a bindaddr different than the one specified in `config`.
