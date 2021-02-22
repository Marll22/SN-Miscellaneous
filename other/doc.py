#python3

import argparse
import xml.etree.ElementTree as ET


def main():
    uset_elements = ("name", "description", "sys_created_by")
    tags = ("sys_class_name", "sys_created_by", "sys_created_on", "sys_id", "sys_mod_count", "sys_name", "sys_package", "sys_policy", "sys_scope", "sys_update_name", "sys_updated_by", "sys_updated_on", "type")

    # Parse command line arguments.
    parser = argparse.ArgumentParser()
    parser.add_argument("-i", "--ifile", required=True, help="The Update Set in XML format", type=str)
    #parser.add_argument("-o", "--ofile", default='outputmd', help="The output file name, with extension (.md)", type=str)
    args = parser.parse_args()

    outputfile = open('output.md', 'w')
    inputfile = ET.parse(args.ifile)
    root = inputfile.getroot()

    # Parse update set information.
    outputfile.write("# Update Set Information\n")
    for element in uset_elements:
        node = root.find('sys_remote_update_set').find(element)
        txt = "- **" + node.tag.replace("sys_", "").replace("_", " ").capitalize() + ":** " + node.text + "\n"
        outputfile.write(txt)

    # Parse technical steps.
    outputfile.write("\n# Technical Steps\n")
    for step in root.findall('sys_update_xml'):
        outputfile.write("- [x] " + step.attrib["action"].capitalize().replace("_", " ") + " **" + step.find("type").text + "**\n")

        ''' Parse Payload '''
        payload = ET.fromstring(step.find("payload").text)
        for child in payload:
            for node in child:
                if (node.tag in tags) == False and node.text != None:
                    if node.tag == "condition" or node.tag == "calculation":
                        txt = "\t- " + str(node.tag).capitalize().replace("_", " ") + ": `" + str(node.text) + "`\n"
                    elif node.tag == "script":
                        txt = "\t- " + str(node.tag).capitalize().replace("_", " ") + ":\n```js\n" + str(node.text) + "\n```\n"
                    else:
                        if node.get("display_value") != None:
                            txt = "\t- " + str(node.tag).capitalize().replace("_", " ") + ": " + str(node.get("display_value")) + "\n"
                        else:
                            txt = "\t- " + str(node.tag).capitalize().replace("_", " ") + ": " + str(node.text) + "\n"

                    outputfile.write(txt)

            outputfile.write("\n\n")

    outputfile.close()
    print('Doc generated')

if __name__ == '__main__':
    main()
