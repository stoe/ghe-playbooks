workflow "Lint Upgrade Playbook on Push" {
  on = "push"
  resolves = ["Lint Ansible Playbook"]
}

action "Lint Ansible Playbook" {
  uses = "stoe/actions/ansible-lint@master"
  env = {
    ACTION_PLAYBOOK_NAME = "playbooks/upgrade/playbook.yml"
  }
}

workflow "Lint License Mailer Playbook on Push" {
  on = "push"
  resolves = ["Lint Ansible Playbook"]
}

action "Lint Ansible Playbook" {
  uses = "stoe/actions/ansible-lint@master"
  env = {
    ACTION_PLAYBOOK_NAME = "playbooks/license-mailer/playbook.yml"
  }
}
