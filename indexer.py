import os
import json
import configparser

# Read the configuration file
config = configparser.ConfigParser()
config.read('./indexer.ini')

# Get the title, vault path, and attachments folder from the configuration
vault_name = config.get('DEFAULT', 'VaultName')
vault_path = config.get('DEFAULT', 'VaultPath')
attachments_folder = config.get('DEFAULT', 'AttachmentsFolder')

def create_index(start_path):
    index = {}

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
                # Create the file ID and add the file to the index
                file_id = os.path.relpath(os.path.join(root, file), start_path).replace('\\', '/')
                parts = file_id.split('/')
                current_level = index
                for part in parts[:-1]:  # Traverse the directories
                    current_level = current_level.setdefault(part, {})
                current_level[parts[-1]] = {
                    'title': os.path.splitext(parts[-1])[0],
                    'created_time': str(int(os.path.getctime(os.path.join(root, file)))),
                    'last_modified_time': str(int(os.path.getmtime(os.path.join(root, file))))
                }

    return index

# Create the index and write it to the index.json file
index = create_index(vault_path)
index_data = {
    'vault': vault_name,
    'attachments_folder': attachments_folder,
    'index': index
}
with open('./app/public/index.json', 'w', encoding='utf-8') as f:
    json.dump(index_data, f, indent=2, ensure_ascii=False)