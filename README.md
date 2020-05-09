# fake-file-generator

#### Fake file generator is a node.js utility to generate files without size limits

> stream-based lightweight package with no dependencies


## Valid and Invalid files

- **Valid files**: filled with valid content for the specific type of file, for example a generated valid file hello.txt of 300 bytes, opened with a text editor, it results in a valid txt file with text content inside.
- **Invalid Files**: filled with zero filled buffer placeholder content, for example a generated invalid file: hello.mp3 of 300 bytes, opened with a mp3 player, it results in a compromised and unplayable file.
> currently, the only supported valid file is: txt.
> 
> the valid txt file is generated with the placeholder: "START-->" at the beginning of the file and the placeholder "<--END" at the end of the file, between "START-->" and  "<--END" is filled with a string pattern of characters from a to z.
>
> here an example of the generated content of a valid txt file: START-->abcdefghilmnopqr<--END 


## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

Install in your project and use as js module:
```sh
$ npm install fake-file-generator
```

Install globally and use as CLI:
```sh
$ npm install -g fake-file-generator
```

## Usage

### 3 modes of usage:

#### 1) JS Module Mode
Require in a js file and use as a module

```javascript
const FakeFileGenerator = require('fake-file-generator');

const filePath = 'output/hello.txt'; // file path to generate 
const size = 10000; // size of the file in bytes (10MB)

// FakeFileGenerator.makeFile() return a promise resolved when the file is completely written on the file system

// invalid generic file
FakeFileGenerator.makeFile(filePath, size)
    .then(() => {
        console.log('file generated!');
    })
    .catch(console.error);

// valid txt file
const options = { type: 'txt' }
FakeFileGenerator.makeFile(filePath, size, options)
    .then(() => {
        console.log('file generated!');
    })
    .catch(console.error);
```

#### 2) CLI Mode
Run as a node CLI program and pass parameters directly to it

###### invalid generic file:
```sh
$ fake-file-generator --fileName hello.txt --size 1000
```

###### valid txt file:
```sh
$ fake-file-generator --fileName hello.txt --size 1000 --type txt
```

#### 3) Interactive CLI Mode
Run as a node CLI program with no parameters and follow the program instructions


```sh
$ fake-file-generator
```
