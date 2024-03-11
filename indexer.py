import os
import json
import configparser
import sys

# Read the configuration file
config = configparser.ConfigParser()
config_file_path = './indexer.ini'
if not os.path.exists(config_file_path):
    sys.exit(f"Configuration file {config_file_path} does not exist.")
config.read(config_file_path)

# Check for required configuration options
required_options = ['VaultName', 'VaultPath', 'AttachmentsFolder', 'Homepage']
for option in required_options:
    if not config.has_option('DEFAULT', option):
        sys.exit(f"Configuration option {option} is missing from {config_file_path}.")
        
# Get the title, vault path, and attachments folder from the configuration
vault_name = config.get('DEFAULT', 'VaultName')
vault_path = config.get('DEFAULT', 'VaultPath')
attachments_folder = config.get('DEFAULT', 'AttachmentsFolder')
homepage = config.get('DEFAULT', 'Homepage')
properties = config.get('DEFAULT', 'Properties').split(', ')

# Initial UID
uid_counter = 1
# uid: file_path
uids = {}


def walk_files(root_path, file_type, exclude_folders=[]):
    # walk the directory structure
    for root, dirs, files in os.walk(root_path):
        # ignore the exclude folders
        for exclude_folder in exclude_folders:
            if exclude_folder in dirs:
                dirs.remove(exclude_folder)
        
        for file in files:
            if file.endswith(file_type):
                file_path = os.path.join(root, file)
                yield file_path

def walk_markdown(root_path):
    return walk_files(root_path, '.md', ['.obsidian', attachments_folder])
        

def read_front_matter(lines):
    # files without front matter
    if not lines or lines[0].strip() != '---':
        return {}
    
    front_matter = {}
    current_key = None
    for line in lines[1:]:
        stripped_line = line.strip()

        # end of front matter
        if stripped_line == '---':
            break

        # list value
        if stripped_line.startswith('-'):
            if current_key:
                front_matter[current_key].append(stripped_line[1:].strip())
        else:
            key_value = stripped_line.split(':')
            # actually contains ':'
            if len(key_value) == 2:
                current_key = key_value[0].strip()

                # ignore keys not in the properties list
                if current_key not in properties:
                    current_key = None
                    continue
                    
                # single-line key-value pair
                if key_value[1]:
                    value = key_value[1].strip()
                    if value:
                        front_matter[current_key] = value
                    
                # multi-line key-value pair
                else :    
                    front_matter[current_key] = []

    return front_matter


def read_uid(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Check whether the file is empty
    if len(lines) == 0:
        return
    
    front_matter = read_front_matter(lines)
    print(front_matter)
    uid = front_matter.get('uid', None)
    if uid:
        return uid

def write_uid(file_path, uid):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    uid_str = f'"{uid}"' if uid.isdigit() else uid  # Wrap the UID in quotes if it's only a number
    if lines and lines[0] == '---\n':  # Check if the file has a front matter
        front_matter_end = lines.index('---\n', 1) if '---\n' in lines[1:] else 1
        lines.insert(front_matter_end, f'uid: {uid_str}\n')
    else:  # If the file doesn't have a front matter, create one
        lines = ['---\n', f'uid: {uid_str}\n', '---\n'] + lines
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)

def register_uids(start_path):
    for file_path in walk_markdown(start_path):
        uid = read_uid(file_path)
        if uid:
            uids[uid] = file_path


def base36encode(number):
    alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
    base36 = ''
    while number:
        number, i = divmod(number, 36)
        base36 = alphabet[i] + base36
    return base36.zfill(4)


def create_uid():
    global uid_counter
    max_uid_counter = 36**4 + 36**3 + 36**2 + 36 # Maximum possible number of unique IDs
    while uid_counter < max_uid_counter:
        uid = base36encode(uid_counter).lstrip('0')
        if uid not in uids:
            uid_counter += 1
            return uid
        uid_counter += 1
    return None  # Return None if no available UID is found within the maximum limit


def create_index(start_path):
    index = {}

    for file_path in walk_markdown(start_path):
        file_id = os.path.relpath(file_path, start_path).replace('\\', '/')
        parts = file_id.split('/')
        current_level = index
        for part in parts[:-1]:  # Traverse the directories
            current_level = current_level.setdefault(part, {})
        current_level[parts[-1]] = {
            'title': os.path.splitext(parts[-1])[0],
            'created_time': str(int(os.path.getctime(file_path))),
            'last_modified_time': str(int(os.path.getmtime(file_path))),
        }
        uid = read_uid(file_path)
        if not uid:
            uid = create_uid()
            uids[uid] = file_path
            write_uid(file_path, uid)
        current_level[parts[-1]]['uid'] = uid

    return index

# Run through the vault and register all existing UIDs from the front matter
register_uids(vault_path)

# Create the index
index = create_index(vault_path)

index_data = {
    'vault': vault_name,
    'attachments_folder': attachments_folder,
    'homepage': homepage,
    'index': index
}
with open('./app/public/index.json', 'w', encoding='utf-8') as f:
    json.dump(index_data, f, indent=2, ensure_ascii=False)