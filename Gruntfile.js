/* global module:false */
module.exports = function (grunt) {
  const port = grunt.option('port') || 8000;
  let root = grunt.option('root') || '.';
  const revealjsPath = grunt.option('revealjsPath') || './reveal.js';
  // TODO - check if file path exists
  const slidesPath = grunt.option('slidesPath') || './content/default';
  let slides = '';

  let slidesTitle = grunt.option('slidesTitle') || slidesPath.split('/')[1];

  if (!Array.isArray(root)) root = [root];

  // Project configuration
  grunt.config.init({

    config: {
      index: `${revealjsPath}/index.html`,
      dist: './dist'
    },

    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner:
        '/*!\n' +
        ' * reveal.js <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd, HH:MM") %>)\n' +
        ' * http://revealjs.com\n' +
        ' * MIT licensed\n' +
        ' *\n' +
        ' * Copyright (C) 2018 Hakim El Hattab, http://hakim.se\n' +
        ' */'
    },

    qunit: {
      files: ['test/*.html']
    },

    uglify: {
      options: {
        banner: '<%= meta.banner %>\n',
        ie8: true
      },
      build: {
        src: `${revealjsPath}/js/reveal.js`,
        dest: `${revealjsPath}/js/reveal.min.js`
      }
    },

    sass: {
      core: {
        src: `${revealjsPath}/css/reveal.scss`,
        dest: `${revealjsPath}/css/reveal.css`
      },
      themes: {
        expand: true,
        cwd: `${revealjsPath}/css/theme/source`,
        src: ['*.sass', '*.scss'],
        dest: `${revealjsPath}/css/theme`,
        ext: '.css'
      }
    },

    autoprefixer: {
      core: {
        src: `${revealjsPath}/css/reveal.css`
      }
    },

    cssmin: {
      options: {
        compatibility: 'ie9'
      },
      compress: {
        src: `${revealjsPath}/css/reveal.css`,
        dest: `${revealjsPath}/css/reveal.min.css`
      }
    },

    jshint: {
      options: {
        curly: false,
        eqeqeq: true,
        immed: true,
        esnext: true,
        latedef: 'nofunc',
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        browser: true,
        expr: true,
        loopfunc: true,
        globals: {
          head: false,
          module: false,
          console: false,
          unescape: false,
          define: false,
          exports: false
        }
      },
      files: ['Gruntfile.js', `${revealjsPath}/js/reveal.js`]
    },

    connect: {
      server: {
        options: {
          port: port,
          base: root,
          livereload: true,
          open: true,
          useAvailablePort: true
        }
      }
    },

    zip: {
      bundle: {
        src: [
          './dist/**'
        ],
        dest: 'reveal-js-presentation.zip'
      }
    },

    watch: {
      js: {
        files: ['Gruntfile.js', `${revealjsPath}/js/reveal.js`],
        tasks: 'js'
      },
      theme: {
        files: [
          `${revealjsPath}/css/theme/source/*.sass`,
          `${revealjsPath}/css/theme/source/*.scss`,
          `${revealjsPath}/css/theme/template/*.sass`,
          `${revealjsPath}/css/theme/template/*.scss`
        ],
        tasks: 'css-themes'
      },
      css: {
        files: [`${revealjsPath}/css/reveal.scss`],
        tasks: 'css-core'
      },
      html: {
        files: root.map(path => path + '/*.html')
      },
      markdown: {
        files: root.map(path => path + '/*.md')
      },
      conference: {
        files: ['./conference/**'],
        tasks: [
          'process-slides',
          'copy'
        ]
      },
      options: {
        livereload: true
      }
    },

    retire: {
      js: [
        `${revealjsPath}/js/reveal.js`,
        `${revealjsPath}/lib/js/*.js`,
        `${revealjsPath}/plugin/!**/!*.js`],
      node: ['.']
    },

    copy: {
      main: {
        expand: true,
        src: [
          `${revealjsPath}/css/**`,
          `${revealjsPath}/js/**`,
          `${revealjsPath}/lib/**`,
          `${revealjsPath}/images/**`,
          `${revealjsPath}/plugin/**`,
          `${revealjsPath}/**.md`
        ],
        dest: 'dist/',
      },
    },

    'process-slides': {
      files: [
        slidesPath + '/**/*.html'
      ]
    }

  });

  // Dependencies
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-retire');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-string-replace');

  grunt.registerMultiTask('process-slides', 'Process slides', function () {

    const name = this.target;
    const data = this.data;
    const files = grunt.file.expand(data);

    grunt.log.writeln('Name:' + name);
    grunt.log.writeln('Data:' + data);
    grunt.log.writeln('Files:' + files);

    let content = '';
    files.map(grunt.file.read).forEach((c, i) => {
      const p = files[i];

      grunt.log.subhead('processhtml - ' + p);
      content += c.toString();
    });

    slides = content;

    grunt.log.write('@@@ slides content:\n', slides);

    const dist = grunt.config.get('config.dist');
    const indexFile = grunt.config.get('config.index');
    const indexFileContent = grunt.file.read(indexFile)
      .replace(/{{slides-title}}/, slidesTitle)
      .replace(/{{slides}}/, slides);
    grunt.file.write(dist + '/' + indexFile, indexFileContent);
  });

  // Default task
  grunt.registerTask('default', ['css', 'js', 'process-slides', 'copy']);

  // JS task
  grunt.registerTask('js', ['jshint', 'uglify', 'qunit']);

  // Theme CSS
  grunt.registerTask('css-themes', ['sass:themes']);

  // Core framework CSS
  grunt.registerTask('css-core', ['sass:core', 'autoprefixer', 'cssmin']);

  // All CSS
  grunt.registerTask('css', ['sass', 'autoprefixer', 'cssmin']);

  grunt.registerTask('build', ['default']);

  // Package presentation to archive
  grunt.registerTask('package', ['default', 'zip']);

  // Serve presentation locally
  grunt.registerTask('serve', ['connect', 'watch']);

  // Run tests
  grunt.registerTask('test', ['jshint', 'qunit']);
};
