#!/usr/bin/env ruby

require 'fileutils'
require 'net/http'
require 'uri'
require 'nokogiri'

module Utils
  def self.curl(url)
    Net::HTTP.get_response(URI.parse(url)).body
  end

  def self.write_file!(path, content)
    dirpath = File.dirname(path)

    FileUtils.mkdir_p(dirpath)
    File.open(path, 'w') { |file| file.write(content) }
  end

  def self.remove_dir!(path)
    FileUtils.rm_r(path) if File.exist?(path)
  end
end

Utils.write_file!(
  File.join(__dir__, 'pages', '1.html'),
  Utils.curl('https://en.wiktionary.org/wiki/Category:Ancient_Greek_verbs'),
)

page = 1
filename = "#{page}.html"
file = File.read(File.join(__dir__, 'pages', filename))
doc = Nokogiri::HTML(file)

links = doc.at_css('#mw-pages').css('a')
links.each_with_index do |link, ii|
  puts "#{ii}/#{links.size} - #{link.text}"

  url = "https://en.wiktionary.org#{link['href']}"

  Utils.write_file!(
    File.join(__dir__, 'pages', 'words', "#{page}-#{ii}.html"),
    Utils.curl(url),
  )

  sleep 2
end

