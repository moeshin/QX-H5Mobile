#!/usr/bin/env bash

mkdir -p dist
echo '<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body>' >>dist/index.html
for project in */; do
  project="${project::-1}"
  out_dir="$project/dist"
  if ! [ -f "$out_dir/index.html" ]; then
    if [ -d "$out_dir/build/h5/index.html" ]; then
      out_dir="$out_dir/build/h5"
    fi
  fi
  echo "out_dir: $out_dir"
  if [ -f "$out_dir/index.html" ]; then
    mv "$out_dir" "dist/$project"
    echo "<li><a href=\"./$project\">$project</a></li>" >>dist/index.html
  fi
done
echo "</ul></body></html>" >>dist/index.html
