#!/usr/bin/env ruby

require 'nokogiri'
require 'json'

def normalize(text)
  text.gsub("\u00A0", ' ').strip.unicode_normalize
end

def write_error(type, filename, headword)
  warn "ERROR: type #{type}, headword #{headword}, filename #{filename}"
end

def matching_labels(rows, columns, row_num, col_num)
  row_labels = []
  previous_column = nil
  rows.each do |row|
    text = row[:text]
    column = row[:column]

    if column > col_num
      break
    end

    if previous_column == nil || previous_column == column - 1
      row_labels << text
    else
      row_labels = [text]
    end

    previous_column = column
  end

  column_labels = []
  previous_row = nil
  columns.each do |col|
    text = col[:text]
    row = col[:row]

    if row > row_num
      break
    end

    if previous_row == nil || previous_row == row - 1
      column_labels << text
    else
      column_labels = [text]
    end

    previous_row = row
  end

  column_labels.reverse + row_labels
end

def permutations(string, matches)
  if matches.size == 0
    return [string]
  end

  first, *rest = *matches

  without = string.sub(/\(.*?\)/, '')
  with = string.sub('(', '').sub(')', '')

  permutations(without, rest) + permutations(with, rest)
end

def permutations2(prefix, strings)
  if strings.size == 0
    return [prefix]
  end

  first, *rest = *strings

  first.flat_map { |s| permutations2(prefix.nil? ? s : "#{prefix} #{s}", rest) }
end

def split_all(string)
  return [] if string == ""

  segments = string.split

  combinations = segments.map { |segment| segment.split(/,|\//).uniq }

  if combinations.size == 1
    combinations.first
  else
    first, *rest = *combinations
    first.product(*rest).map { |n| n.join(' ') }
  end
end

def convert(strings)
  hash = {
    'present' => { tense: 'p' }, # present
    'imperfect' => { tense: 'i' }, # imperfect
    'future' => { tense: 'f' }, # future
    'aorist' => { tense: 'a' }, # aorist
    'perfect' => { tense: 'r' }, # perfect
    'pluperfect' => { tense: 'l' }, # pluperfect
    'future perfect' => { tense: 't' }, # future perfect
    'indicative' => { mood: 'i' }, # indicative
    'subjunctive' => { mood: 's' }, # subjunctive
    'optative' => { mood: 'o' }, # optative
    'imperative' => { mood: 'm' }, # imperative
    'singular' => { number: 's' }, # singular
    'dual' => { number: 'd' }, # dual
    'plural' => { number: 'p' }, # plural
    'first' => { person: '1' }, # first
    'second' => { person: '2' }, # second
    'third' => { person: '3' }, # third
    'active' => { voice: 'a' }, # active
    'middle' => { voice: 'm' }, # middle
    'passive' => { voice: 'p' }, # passive
    'middle/passive' => { voice: 'e' }, # middle/passive
    "middle/\npassive" => { voice: 'e' }, # middle/passive
    'infinitive' => { form: 'i' }, # infinitive
    'participle' => { form: 'p' }, # participle
    'm' => { gender: 'm' }, # masculine
    'f' => { gender: 'f' }, # feminine
    'n' => { gender: 'n' }, # neuter
  }
  result = {}
  
  strings.each do |string|
    if hash[string]
      result = result.merge(hash[string])
    else
      puts("unrecognized: #{string.inspect}, #{string.inspect}")
    end
  end

  result
end

def convert_table(table, words, headword, head)
  row_headers = []
  column_headers = []

  tense, rest = *head.split(':', 2)
  tense = normalize(tense.downcase)
  root, notes = *rest.split('(', 2)
  root = normalize(root || '')
  notes = notes ? normalize(notes.downcase).chomp(')') : nil

  col_skip = []

  table.css('tr').each_with_index do |tr, row_num|
    col_num = 0
    col_skip[row_num] ||= []
    tr.css('td, th').each_with_index do |td|
      while col_skip[row_num][col_num]
        col_num += 1
      end

      rowspan = td.attribute('rowspan')
      colspan = td.attribute('colspan')

      rowspan = rowspan ? rowspan.value.to_i : 1
      colspan = colspan ? colspan.value.to_i : 1

      (row_num...(row_num + rowspan)).each do |ii|
        (col_num...(col_num + colspan)).each do |jj|
          col_skip[ii] ||= []
          col_skip[ii][jj] = true
        end
      end

      if td.name == 'th'

        (row_num...(row_num + rowspan)).each do |ii|
          row_headers[ii] ||= []
          row_headers[ii] << { text: normalize(td.text), column: col_num }
        end

        (col_num...(col_num + colspan)).each do |jj|
          column_headers[jj] ||= []
          column_headers[jj] << { text: normalize(td.text), row: row_num }
        end
      else
        if td.css('[lang=grc]').count > 0 && (row_headers[row_num].none? { |t| t[:text] == 'Notes:' })
          split_all(normalize(td.text())).each do |string|
            matches = string.scan( /\(.*?\)/ )

            labels = matching_labels(row_headers[row_num], column_headers[col_num], row_num, col_num)

            label_hash = {
              headword: headword,
              root: root,
            }
            if notes
              label_hash[:notes] = notes
            end

            labels << tense

            label_hash = label_hash.merge(convert(labels))

            permutations(string, matches).each do |permutation|
              words[permutation] ||= []
              words[permutation] << label_hash
            end
          end
        end
      end

      col_num += colspan
    end
  end

  words
end

def remove_macrons(str)
  str.unicode_normalize(:nfd).chars.reject { |ch| ["\u0304", "\u0305", "\u0306", "\u0308"].member?(ch) }.join('').unicode_normalize
end

def remove_diacritics(str)
  str.downcase.unicode_normalize(:nfd).chars.reject { |ch| ch !~ /[αβγδεζηθικλμνξοπρσςτυφχψω ]/ }.join('').unicode_normalize
end

words = {}

headwords = []
headword_map = {}
roots = []
root_map = {}
notes = []
note_map = {}

files = Dir.glob('./pages/words/*')

files.each_with_index do |filename, ii|
  file = File.read(filename)
  doc = Nokogiri::HTML(file)

  headword = doc.at_css('#firstHeading').text

  puts "#{ii}/#{files.length} - #{headword} #{filename}"

  if !headword
    write_error(:no_heading, filename, headword)
    next
  end

  headword = normalize(headword)

  inflections = doc.css('.NavFrame').select { |frame| frame.at_css('.NavHead').css('[lang=grc]').count > 0 }

  if inflections.length == 0
    write_error(:no_inflections, filename, headword)
    next
  end

  # headword index ~ root index ~ notes index ~ tense mood number person voice form gender

  inflections.each do |inflection|
    head = normalize(inflection.at_css('.NavHead').text)

    inflection.at_css('.NavContent').css('table').map do |table|
      convert_table(table, words, headword, head)
    end
  end
end

words.each do |word, values|
  words[word] = values.map do |value|
    shortword = []

    headword = value[:headword]
    if !headword_map[headword]
      headword_map[headword] = headwords.size
      headwords << headword
    end

    shortword << headword_map[headword]

    root = value[:root]
    if !root_map[root]
      root_map[root] = roots.size
      roots << root
    end

    shortword << root_map[root]

    note = value[:notes]
    if note
      if !note_map[note]
        note_map[note] = notes.size
        notes << note
      end

      shortword << note_map[note]
    else
      shortword << ''
    end

    shortword << [
      value[:tense] || '-',
      value[:mood] || '-',
      value[:number] || '-',
      value[:person] || '-',
      value[:voice] || '-',
      value[:form] || '-',
      value[:gender] || '-',
    ].join('')

    shortword.join('~')
  end.uniq
end

macron_removed = {}
diacritic_removed = {}

words.keys.each do |word|
  macron_removed_word = remove_macrons(word)
  diacritic_removed_word = remove_diacritics(word)

  macron_removed[macron_removed_word] ||= []
  macron_removed[macron_removed_word] << word

  diacritic_removed[diacritic_removed_word] ||= []
  diacritic_removed[diacritic_removed_word] << word
end

# File.open('lookup.json', 'w') { |f| f.write(words.to_json) }
File.open('json/lookup.json', 'w') { |f| f.write(JSON.pretty_generate(words)) }

File.open('json/headwords.json', 'w') { |f| f.write(headwords.to_json) }
File.open('json/roots.json', 'w') { |f| f.write(roots.to_json) }
File.open('json/notes.json', 'w') { |f| f.write(notes.to_json) }
File.open('json/macron-lookup.json', 'w') { |f| f.write(macron_removed.to_json) }
File.open('json/diacritic-lookup.json', 'w') { |f| f.write(diacritic_removed.to_json) }
