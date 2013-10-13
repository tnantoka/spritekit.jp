#!/usr/bin/env ruby

require 'gepub'
require 'yaml'

config = YAML.load_file('../_config.yml')

`cd ../; jekyll build --config _config.yml,epub/_override.yml; cd epub/`

builder = GEPUB::Builder.new do

  language 'ja'
  unique_identifier 'http://spritekit.jp/tutorial/', 'BookID', 'URL'

  title 'SrpiteKit.jp チュートリアル EPUB版'  

  creator 'tnantoka'
  publisher 'SpriteKit.jp'

  date Time.now

  resources(workdir: '../_site/') do

    file 'vendor/bootstrap/dist/css/bootstrap.min.css'
    file 'vendor/bootstrap/assets/css/docs.css'
    #file 'vendor/font-awesome/css/font-awesome.min.css'
    file 'css/main.css'
    file 'css/syntax.css'
    file 'css/epub.css'

    config['tutorial'].each do |k, v|
      glob "img/tutorial/#{k}/*.*"

    end

    ordered do
      config['tutorial'].each do |k, v|
        file "tutorial/#{k}/index.html"
        heading v
      end
    end
  end

end
builder.generate_epub('sj-tutorial.epub')

