from pathlib import Path
import os
import shutil
import subprocess
import sys

binary = Path(sys.argv[1]).resolve()
if sys.platform == 'darwin':
    runtime = Path(__file__).resolve().parent / '.runtime'
    runtime.mkdir(exist_ok=True)
    libraries = subprocess.check_output(['otool', '-L', str(binary)], text=True).splitlines()[1:]
    for line in libraries:
        source = line.strip().split(' (', 1)[0]
        if source.startswith(('/usr/lib/', '/System/', '@')):
            continue
        target = runtime / Path(source).name
        shutil.copy2(source, target)
        relative = '@loader_path/' + os.path.relpath(target, binary.parent)
        subprocess.run(['install_name_tool', '-change', source, relative, str(binary)], check=True)
    subprocess.run(['codesign', '--force', '--sign', '-', str(binary)], check=True)
