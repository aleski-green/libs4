# Run Bundler against libs4 while preserving the application's working directory.
require 'rbconfig'
root = File.expand_path('..', __dir__)
ENV['BUNDLE_GEMFILE'] = File.join(__dir__, 'Gemfile')
ENV['BUNDLE_PATH'] ||= File.join(__dir__, '.gems')
ENV['PYTHONDONTWRITEBYTECODE'] ||= '1'
python = File.join(root, 'python/.venv', Gem.win_platform? ? 'Scripts/python.exe' : 'bin/python')
ENV['SAPIENS_PYTHON'] ||= python if File.file?(python)
exec(RbConfig.ruby, Gem.bin_path('bundler', 'bundle'), *ARGV)
