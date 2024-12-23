#!/bin/bash


# Validate the input parameter
if [[ -z "$1" ]]; then
  echo "Error: No version parameter provided."
  exit 1
fi

VERSION=$1

# Define versioning patterns
SEMVER_PATTERN="^[0-9]+\.[0-9]+\.[0-9]+(-beta\.[0-9]+)?(-rc\.[0-9]+)?$"
PRESET_PATTERN="^(major|minor|patch|release)-([A-Za-z0-9_.-]+)?.*$"

if [[ $VERSION =~ $SEMVER_PATTERN ]]; then
  echo "SEMVER_PATTERN: $VERSION"
  pnpm version $VERSION --no-git-tag-version --no-commit-hooks --no-git-tag-version
elif [[ $VERSION =~ $PRESET_PATTERN ]]; then
  # Extract the preset type from the input
  PRESET_TYPE=$(echo $VERSION | cut -d'-' -f1)
  PREID=$(echo $VERSION | cut -d'-' -f2 | cut -d'.' -f1)

  if [[ -n $PREID ]]; then
    echo "PREID: $PREID"
    echo "PRESET_TYPE: $PRESET_TYPE"
    OUTPUT_VERSION=$(pnpm version pre$PRESET_TYPE --preid $PREID --no-git-tag-version --no-commit-hooks --no-git-tag-version -f)
    echo "output_version=$OUTPUT_VERSION" >> $GITHUB_OUTPUT
  else
    echo "PRESET_TYPE: $PRESET_TYPE"
    OUTPUT_VERSION=$(pnpm version $PRESET_TYPE --no-git-tag-version --no-commit-hooks --no-git-tag-version -f)
    echo "output_version=$OUTPUT_VERSION" >> $GITHUB_OUTPUT
  fi

  
else
  echo "Error: Invalid version parameter."
  exit 1
fi