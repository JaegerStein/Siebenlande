import os
import json
import configparser
import uuid

# Read the configuration file
config = configparser.ConfigParser()
config.read('./indexer.ini')

# Get the title, vault path, and attachments folder from the configuration
vault_name = config.get('DEFAULT', 'VaultName')
vault_path = config.get('DEFAULT', 'VaultPath')
attachments_folder = config.get('DEFAULT', 'AttachmentsFolder')
homepage = config.get('DEFAULT', 'Homepage')

uids = {}


def walk_markdown(start_path):
    # Walk the directory structure
    for root, dirs, files in os.walk(start_path):
        # Ignore the .obsidian folder
        if '.obsidian' in dirs:
            dirs.remove('.obsidian')

        # Ignore the attachments folder, except for the shared folder
        if attachments_folder in dirs and not root.endswith('!shared'):
            dirs.remove(attachments_folder)

        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                yield file_path


def read_uid(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Check whether the file is empty
    if len(lines) == 0:
        return

    # Check if the file contains front matter
    if lines[0].strip() == '---':
        front_matter = {}
        for line in lines[1:]:
            if line.strip() == '---':
                break
            key_value = line.strip().split(':')
            if len(key_value) == 2:
                front_matter[key_value[0].strip()] = key_value[1].strip()

        uid = front_matter.get('uid', None)
        if uid:
            return uid


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


uid_counter = 1


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
        uid = read_uid(file_path)
        if not uid:
            uid = create_uid()
            uids[uid] = file_path
                
        # Create the file ID and add the file to the index
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
        # add uid if it exists for this file
        if uid:
            current_level[parts[-1]]['uid'] = uid

    return index


register_uids(vault_path)
print(uids)

# Create the index and write it to the index.json file
index = create_index(vault_path)

index_data = {
    'vault': vault_name,
    'attachments_folder': attachments_folder,
    'homepage': homepage,
    'index': index
}
with open('./app/public/index.json', 'w', encoding='utf-8') as f:
    json.dump(index_data, f, indent=2, ensure_ascii=False)