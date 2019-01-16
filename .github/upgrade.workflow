workflow "Lint Ansible Playbook on Push" {
  on = "push"
  resolves = ["DEBUG", "Lint Ansible Playbook"]
}

action "DEBUG" {
  uses = "actions/bin/debug@master"
}

action "Lint Ansible Playbook" {
  uses = "stoe/actions/ansible-lint@master"
  env = {
    ACTION_PLAYBOOK_NAME = "playbooks/upgrade/playbook.yml"
  }
}
